ALTER TABLE yhaas_whitelist_form
RENAME COLUMN strategy_addresses TO strategy_address;

ALTER TABLE yhaas_whitelist_form
ALTER COLUMN strategy_address TYPE text USING strategy_address[1];
