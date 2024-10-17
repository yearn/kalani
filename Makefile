dev:
	@tmux new-session -d -s devenv
	@tmux splitw -v -l 50% -t devenv
	@tmux selectp -t 0
	@tmux splitw -h -l 50% -t devenv

	@tmux send-keys -t devenv:0.0 'bun dev' C-m
	@tmux send-keys -t devenv:0.1 'bun dev:api' C-m

	@tmux selectp -t 2
	@tmux attach-session -t devenv

down:
	@tmux kill-server

