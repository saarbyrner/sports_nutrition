# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a sports nutrition application repository that is currently in initial setup phase.

## Development Commands

### General
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint

### Supabase CLI
- `npx supabase init` - Initialize Supabase project
- `npx supabase start` - Start local Supabase instance
- `npx supabase stop` - Stop local Supabase instance
- `npx supabase status` - Check status of local services
- `npx supabase db reset` - Reset local database
- `npx supabase db push` - Push local migrations to remote
- `npx supabase db pull` - Pull remote schema to local
- `npx supabase gen types typescript` - Generate TypeScript types

## Architecture & Structure

*Note: Architecture information will be documented as the codebase develops.*

## Important Notes

- This is a sports nutrition application with player management functionality
- Project structure includes React components, Supabase integration, and TypeScript services
- Update this file as the project evolves with build commands, testing procedures, and architectural decisions

## ⚠️ CRITICAL SECURITY WARNING ⚠️

**RLS (Row Level Security) is currently DISABLED on `users` and `players` tables.**

This was an emergency fix applied on 2025-07-21 to resolve infinite recursion errors that were causing 500 server errors. 

**See `supabase/RLS-SECURITY-REMINDER.md` for full details and remediation plan.**

**⚠️ DO NOT DEPLOY TO PRODUCTION WITHOUT RE-ENABLING PROPER RLS POLICIES ⚠️**