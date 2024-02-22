ALTER TABLE yhaas_whitelist_form
RENAME COLUMN strategy_address TO strategy_addresses;

ALTER TABLE yhaas_whitelist_form
ALTER COLUMN strategy_addresses TYPE text[] USING ARRAY[strategy_addresses];
