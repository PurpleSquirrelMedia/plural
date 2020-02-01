defmodule GraphQl.Resolvers.Payments do
  use GraphQl.Resolvers.Base, model: Core.Schema.Subscription
  alias Core.Services.{Payments, Users}
  alias Core.Schema.{Plan}

  def query(Plan, _), do: Plan.ordered()
  def query(Subscription, _), do: Subscription

  def resolve_subscription(%{id: repo_id}, %{id: user_id}),
    do: {:ok, Payments.get_subscription(repo_id, user_id)}

  def create_subscription(
    %{attributes: attrs, plan_id: plan_id, installation_id: inst_id},
    %{context: %{current_user: user}}
  ), do: Payments.create_subscription(attrs, plan_id, inst_id, user)
  def create_subscription(%{plan_id: plan_id, installation_id: inst_id}, %{context: %{current_user: user}}),
    do: Payments.create_subscription(plan_id, inst_id, user)

  def create_customer(%{source: source}, %{context: %{current_user: user}}),
    do: Payments.register_customer(user, source)

  def create_plan(%{attributes: attrs, repository_id: id}, %{context: %{current_user: user}}),
    do: Payments.create_plan(attrs, id, user)

  def update_line_item(%{attributes: attrs, subscription_id: id}, %{context: %{current_user: user}}),
    do: Payments.update_line_item(attrs, id, user)

  def update_plan(%{plan_id: plan_id, subscription_id: id}, %{context: %{current_user: user}}),
    do: Payments.update_plan(plan_id, id, user)

  def link_publisher(%{token: token}, %{context: %{current_user: user}}) do
    Users.get_publisher_by_owner!(user.id)
    |> Payments.create_publisher_account(token)
  end
end