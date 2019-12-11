defmodule Watchman.Storage do

  @callback init() :: :ok | {:error, term}

  @callback pull() :: :ok | {:error, term}

  @callback push() :: :ok | {:error, term}
end