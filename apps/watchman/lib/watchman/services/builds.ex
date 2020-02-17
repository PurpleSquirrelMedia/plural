defmodule Watchman.Services.Builds do
  use Watchman.Services.Base
  alias Watchman.PubSub
  alias Watchman.Schema.{Build, Command}

  def get!(id), do: Repo.get!(Build, id)

  def create(attrs) do
    %Build{type: :deploy, status: :queued}
    |> Build.changeset(attrs)
    |> Repo.insert()
    |> when_ok(&wake_deployer/1)
    |> when_ok(&broadcast(&1, :create))
  end

  def create_command(attrs, %Build{id: id}) do
    %Command{build_id: id}
    |> Command.changeset(attrs)
    |> Repo.insert()
    |> when_ok(&broadcast(&1, :create))
  end

  def complete(%Command{stdout: stdout} = command, exit_code) do
    %{command | stdout: nil}
    |> Command.changeset(%{
      exit_code: exit_code,
      completed_at: Timex.now(),
      stdout: stdout
    })
    |> Repo.update()
    |> when_ok(&broadcast(&1, :update))
  end

  def poll() do
    Build.queued()
    |> Build.first()
    |> Build.ordered(desc: :inserted_at)
    |> Repo.one()
  end

  def running(build),
    do: modify_status(build, :running)

  def succeed(build) do
    modify_status(build, :successful)
    |> notify(:succeed)
  end

  def fail(build) do
    modify_status(build, :failed)
    |> notify(:failed)
  end

  defp modify_status(build, state) do
    build
    |> Build.changeset(add_completion(%{status: state}, state))
    |> Repo.update()
    |> when_ok(&broadcast(&1, :update))
  end

  defp add_completion(attrs, state) when state in [:successful, :failed],
    do: Map.put(attrs, :completed_at, Timex.now())
  defp add_completion(attrs, _), do: attrs

  defp wake_deployer(build) do
    Watchman.Deployer.wake()
    {:ok, build}
  end

  defp notify({:ok, %Build{} = build}, :succeed),
    do: handle_notify(PubSub.BuildSucceeded, build)
  defp notify({:ok, %Build{} = build}, :failed),
    do: handle_notify(PubSub.BuildFailed, build)
  defp notify(error, _), do: error
end