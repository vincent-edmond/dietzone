-- Sécurité : le trigger ne doit pas être appelable via l'API REST.
revoke execute on function public.handle_new_user() from public, anon, authenticated;
