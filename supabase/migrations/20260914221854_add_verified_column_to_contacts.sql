/*
# Add "verified" column to contacts

## Overview
Adds a boolean column `verified` to the `contacts` table, defaulting to `false`.
This lets the admin mark individual contacts as verified (green checkmark badge).
No existing data is modified — all contacts start as unverified.

## Changes
- `contacts.verified` (boolean, NOT NULL, default false)

## Security
- No changes to existing RLS policies. The new column is readable by anyone
  who can already SELECT contacts, and writable by authenticated admins
  via the existing UPDATE policy.
*/

ALTER TABLE contacts
  ADD COLUMN IF NOT EXISTS verified boolean NOT NULL DEFAULT false;
