--
-- Add initial users to DB
--

INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, invited_at, confirmation_token, confirmation_sent_at, recovery_token, recovery_sent_at, email_change_token_new, email_change, email_change_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, created_at, updated_at, phone, phone_confirmed_at, phone_change, phone_change_token, phone_change_sent_at, email_change_token_current, email_change_confirm_status, banned_until, reauthentication_token, reauthentication_sent_at) VALUES ('00000000-0000-0000-0000-000000000000', '580c5406-4bd4-4594-bb7c-61ea112204ef', 'authenticated', 'authenticated', 'dev@koapps.io', '$2a$10$ub1.cSmueAQvE6uOYOJsMeJTwrTNh2pCsZ8VWtmueGU8dQY50wgg.', '2022-10-02 09:43:34.008358+00', NULL, '', NULL, '', NULL, '', '', NULL, '2022-10-02 09:47:18.218053+00', '{"provider": "email", "providers": ["email"]}', '{}', NULL, '2022-10-02 09:43:34.001327+00', '2022-10-02 09:47:18.21957+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL);
INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at) VALUES ('580c5406-4bd4-4594-bb7c-61ea112204ef', '580c5406-4bd4-4594-bb7c-61ea112204ef', '{"sub": "580c5406-4bd4-4594-bb7c-61ea112204ef"}', 'email', '2022-10-02 09:43:34.006669+00', '2022-10-02 09:43:34.006695+00', '2022-10-02 09:43:34.006697+00');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '8787464d-0d86-4713-82f5-db3e9e4c28bc', '{"action":"user_signedup","actor_id":"580c5406-4bd4-4594-bb7c-61ea112204ef","actor_username":"dev@koapps.io","log_type":"team","traits":{"provider":"email"}}', '2022-10-02 09:43:34.007553+00', '');


--
-- Add initial transactions to DB
--

INSERT INTO public."Transactions" (id, created_at, boardgame, date, type, amount, boardgame_sent, amount_sent, owner_id) VALUES ('19219ac0-047b-4fab-8125-0ed943b73efd', '2022-10-02 09:44:45+00', NULL, '2022-09-09', 'INCOME', 3000, NULL, NULL, '580c5406-4bd4-4594-bb7c-61ea112204ef');
INSERT INTO public."Transactions" (id, created_at, boardgame, date, type, amount, boardgame_sent, amount_sent, owner_id) VALUES ('151f9310-28c5-475f-b9d5-0641ba2957ce', '2022-10-02 09:45:15+00', 'Imperium Antyk i Legendy', '2022-09-22', 'BUY', 194.4, NULL, NULL, '580c5406-4bd4-4594-bb7c-61ea112204ef');
INSERT INTO public."Transactions" (id, created_at, boardgame, date, type, amount, boardgame_sent, amount_sent, owner_id) VALUES ('6392d89b-a3e6-431e-a16c-b35b37637a9e', '2022-10-02 09:45:50+00', 'Diuna Imperium', '2022-09-28', 'BUY', 150, NULL, NULL, '580c5406-4bd4-4594-bb7c-61ea112204ef');
INSERT INTO public."Transactions" (id, created_at, boardgame, date, type, amount, boardgame_sent, amount_sent, owner_id) VALUES ('6a71f872-7dfd-4c21-8b50-82889f5e01f9', '2022-10-02 09:46:13+00', 'Massive Darkness 2', '2022-08-18', 'SELL', 1482, NULL, NULL, '580c5406-4bd4-4594-bb7c-61ea112204ef');
INSERT INTO public."Transactions" (id, created_at, boardgame, date, type, amount, boardgame_sent, amount_sent, owner_id) VALUES ('d1b76ed8-f672-47a7-911d-df50a7c1961e', '2022-10-02 09:46:33+00', 'Coimbra', '2022-08-12', 'SWAP', 0, 'Le Havre', 0, '580c5406-4bd4-4594-bb7c-61ea112204ef');