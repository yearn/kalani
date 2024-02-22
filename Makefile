
dev:
	bun install
	@docker compose up -d postgres

	@tmux new-session -d -s devenv

	# Layout panes
	@tmux splitw -v -p 50
	@tmux selectp -t 0
	@tmux splitw -h -p 50

	# Run commands
	@tmux send-keys -t devenv:0.0 'bun dev' C-m
	@tmux send-keys -t devenv:0.1 'sleep 4 && bun migrate up && PGPASSWORD=password psql --host=localhost --port=5432 --username=user --dbname=user' C-m

	@tmux selectp -t 2
	@tmux attach-session -t devenv

	# This happens when tmux session ends
	@docker compose down


down:
	@docker compose down
	-@tmux kill-server
