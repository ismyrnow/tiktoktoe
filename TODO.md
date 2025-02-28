# TODO List

## High Priority
- [ ] Set up app hosting on homelab

## Low Priority
- [ ] Combine server and client to simplify dev, deployment, and hosting
- [ ] BUG: Client should handle server restarting
- [ ] Improve UI so that board fits fully onto screen on both mobile and desktop
- [ ] Add timestamps to games
- [ ] Look into simplifying game service to just track Game state changes, and extracting common game logic to useGameService
- [ ] Add unit tests to client
- [ ] Add unit tests to server

## Completed
- [x] Build front-end client with UI for all game states
- [x] Build game service for local play (testing with two browser tabs)
- [x] Build game service for supabase
  - Supabase shuts down unused apps after 90 days of innactivity.
  - I chose to move away from a serverless platform, and instead write a local server that I can host.
- [x] Build game service using socket.io
- [x] Auto join
- [x] Remove Supabase user and game service
- [x] Remove need for user service entirely
- [x] Add server game monitoring
- [x] BUG: Fix game cleanup logic
- [x] Improve UI to clarify when it's your turn or you're waiting
- [x] BUG: Client should handle opponent disconnecting
- [x] BUG: Player 1 can play first move before player 2 joins
- [x] Dockerize app
- [x] Add github workflow for docker container publishing