# HSChat

## Requirements

### Linux / Windows (WSL)

```bash
# Install yarn
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt-get update && sudo apt-get install yarn

# Install node
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs build-essential
```

### macOS

```bash
# For homebrew
brew install node@8 yarn

# else check 
# - https://nodejs.org/en/
# - https://yarnpkg.com/en/docs/install
```

## Setup

```bash
yarn install
```

For consistent experience create an account at https://expo.io/ and login to it via:

```
expo login
```

## Running it

This requires a backend running to test new features, otherwise it uses production.
Control the used backend via the CHAT_ENDPOINT env variable

```
CHAT_ENDPOINT=http://localhost:3030 yarn start
```

  
 