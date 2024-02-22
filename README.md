# yAuto
Vault and strategy automation


#### requirements
make, bun, docker, docker-compose, tmux


## lfg
```sh
cp .env.example .env
# configure .env
make dev
```


## env
**POSTGRES_** - postgres connection info (defaults are gud for local dev)

**WALLETCONNECT_** - walletconnect connection info, [https://cloud.walletconnect.com/](https://cloud.walletconnect.com/)

**GITHUB_APP_** - github app connection info, [https://docs.github.com/en/apps/overview](https://docs.github.com/en/apps/overview)


## tmux
**quit** - `ctrl+b`, `:` then `kill-session` (your dev environment will also shutdown gracefully)

**pane navigation** - `ctrl+b` then `arrow keys`

**zoom\unzoom pane** - `ctrl+b` then `z`

**scroll** - `ctrl+b` then `[` then `arrow keys` or `page up\down keys` then `q` to quit scroll mode

**more** - [tmux shortcuts & cheatsheet](https://gist.github.com/MohamedAlaa/2961058)


## database migrations
**create** - `bun migrate create <migration-name> --sql-file`

**up** - `bun migrate up [name|-c count|...]`

**down** - `bun migrate down [-c count|...]`


## tests
```sh
bun test
```


## 'make' sure your dev environment is shutdown lol
```sh
make down
```


## siwe
This app uses [siwe](https://www.npmjs.com/package/siwe) and [ironSession](https://www.npmjs.com/package/iron-session) to implement Sign-In with Ethereum, [eip-4361](https://eips.ethereum.org/EIPS/eip-4361).


## production
```sh
bun run build
```
