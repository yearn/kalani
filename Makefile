dev:
	@tmux new-session -d -s kalanidevenv
	@tmux splitw -v -l 50% -t kalanidevenv
	@tmux selectp -t 0
	@tmux splitw -h -l 50% -t kalanidevenv

	@tmux send-keys -t kalanidevenv:0.0 'bun dev' C-m
	@tmux send-keys -t kalanidevenv:0.1 'bun dev:api' C-m

	@tmux selectp -t 2
	@tmux attach-session -t kalanidevenv

down:
	-@tmux kill-session -t kalanidevenv
