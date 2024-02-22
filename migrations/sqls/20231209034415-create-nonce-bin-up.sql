CREATE TABLE IF NOT EXISTS nonce_bin (
  nonce text NOT NULL,
  stale_as_of timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT nonce_bin_pkey PRIMARY KEY (nonce)
);

CREATE TABLE IF NOT EXISTS yhaas_whitelist_form (
  chain_id int4 NOT NULL,
  strategist_address text NOT NULL,
  strategy_address text NOT NULL,
  strategy_name text NOT NULL,
  strategy_code_url text NOT NULL,
  harvest_frequency text NOT NULL,
  github_issue_url text NOT NULL,
  github_issue_html_url text NOT NULL,
  github_issue_labels text[] NOT NULL,
  github_issue_state text NOT NULL,
  create_time timestamptz NOT NULL,
  update_time timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT yhaas_whitelist_form_pkey PRIMARY KEY (chain_id, strategist_address, strategy_address, github_issue_url)
);
