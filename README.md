This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, install packages.
Note: I had to manually downgrade to react 18.2 for zustand to install.

```bash
npm install appwrite node-appwrite zustand immer
```

## Database Structure
I decided to use Appwrite's Node SDK to either get or setup the database in the middleware (using [this](https://www.youtube.com/playlist?list=PLRAV69dS1uWRJcxXk1omgcMI07ygMxSRl) YouTube Tutorial by Hitesh Choudhary).

There are two types of collections:
- players collection
- league collections

A player can have many games in different leagues, where each document are typical game stats for an individual player. I decided against using database relations, since Appwrite does not support querying these types yet.

For now, I only focus on basketball stats from german leagues.

## Functionality
The goal is to have two types of Appwrite cloud functions:
- add a player + past games using web scraping
- periodically update collections with new game stats

These updates then will show up as realtime changes in the Web UI.

Basic UI components with [shadcn](https://ui.shadcn.com/)

```bash
npx shadcn@latest add button card input label popover avatar badge
```

# Future Plans
I want to further expand this project to enable small teams of players-coaches to set, track and review individual performance goals.
Integrations with e.g. WHOOP fitness bands could add another layer of depth to goal setting.
Using Appwrite, Authentication setup will be straight forward.
