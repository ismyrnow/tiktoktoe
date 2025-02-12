# TODO List

## Important
- [ ] Rework game initialization - create-vs-join, short game ids
- [ ] Dockerize app
- [ ] Add github workflow for docker container publishing
- [ ] Set up app hosting on homelab

## Clean Up
- [ ] Remove Supabase user and game service
- [ ] Remove need for user service entirely
- [ ] Look into simplifying game service to just track Game state changes, and extracting common game logic to useGameService
- [ ] Look into combining server and client to simplify dev and deployment

## Completed
- [x] Build front-end client with UI for all game states
- [x] Build game service for local play (testing with two browser tabs)
- [x] Build game service for supabase
  - Supabase shuts down unused apps after 90 days of innactivity.
  - I chose to move away from a serverless platform, and instead write a local server that I can host.
- [x] Build game service using socket.io