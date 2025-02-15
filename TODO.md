# TODO List

## High Priority
- [ ] BUG: Client should handle server restarting
- [ ] BUG: Client should handle opponent disconnecting
- [ ] Improve UI to clarify when it's your turn or you're waiting
- [ ] Dockerize app
- [ ] Add github workflow for docker container publishing
- [ ] Set up app hosting on homelab

## Low Priority
- [ ] Look into simplifying game service to just track Game state changes, and extracting common game logic to useGameService
- [ ] Look into combining server and client to simplify dev and deployment
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