FROM debian:stable-slim

RUN apt-get update && apt-get install -y build-essential python3-pip python3 bash nodejs npm zsh jq openssh-client git curl vim zsh-autosuggestions zsh-syntax-highlighting && rm -rf /var/lib/apt/lists/*
RUN sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
RUN echo "source /usr/share/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh" >> ~/.zshrc && echo "source /usr/share/zsh-autosuggestions/zsh-autosuggestions.zsh" >> ~/.zshrc

RUN echo "export PATH=$PATH:/root/.local/bin:/root/bin" >> ~/.zshrc
ENV SHELL /bin/zsh

RUN curl -sSfL https://raw.githubusercontent.com/ava-labs/avalanche-cli/main/scripts/install.sh | sh -s