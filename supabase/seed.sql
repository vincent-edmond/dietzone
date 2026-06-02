-- Données de démonstration DietZone (Alexandre complétera via l'admin).
-- Idempotent : on vide d'abord le catalogue.
truncate product_objectives, product_variants, products, categories, brands, objectives restart identity cascade;

insert into categories (name, slug, position) values
  ('Protéines','proteines',1),
  ('Créatine','creatine',2),
  ('Pre-workout','pre-workout',3),
  ('Acides aminés','acides-amines',4),
  ('Prise de masse','prise-de-masse-cat',5),
  ('Santé & bien-être','sante-bien-etre',6);

insert into brands (name, slug) values
  ('Gaspari Nutrition','gaspari'),
  ('Cellucor','cellucor'),
  ('NPL','npl'),
  ('Pro HCD','pro-hcd');

insert into objectives (name, slug) values
  ('Prise de masse','prise-de-masse'),
  ('Sèche','seche'),
  ('Énergie','energie'),
  ('Santé','sante');

-- Helper inline : insert produit + variantes + objectifs
-- 1) SuperPump Max (Gaspari, pre-workout, énergie)
insert into products (name, slug, description, brand_id, category_id)
select 'SuperPump Max','superpump-max','Pré-workout ultime : énergie, focus et congestion musculaire.',
       (select id from brands where slug='gaspari'), (select id from categories where slug='pre-workout');
insert into product_variants (product_id, label, sku, price_cents, stock_qty)
select id,'Fruit Punch 480g','SPM-FP-480',4900,15 from products where slug='superpump-max';
insert into product_objectives (product_id, objective_id)
select (select id from products where slug='superpump-max'), id from objectives where slug='energie';

-- 2) Proven Creatine (Gaspari, créatine, prise de masse)
insert into products (name, slug, description, brand_id, category_id)
select 'Proven Creatine','proven-creatine','Créatine monohydrate Creapure pour force et volume.',
       (select id from brands where slug='gaspari'), (select id from categories where slug='creatine');
insert into product_variants (product_id, label, sku, price_cents, stock_qty)
select id,'300g','PC-300',3500,20 from products where slug='proven-creatine';
insert into product_objectives (product_id, objective_id)
select (select id from products where slug='proven-creatine'), id from objectives where slug='prise-de-masse';

-- 3) C4 Original (Cellucor, pre-workout, énergie)
insert into products (name, slug, description, brand_id, category_id)
select 'C4 Original','c4-original','Le pre-workout iconique de Cellucor : énergie explosive et endurance.',
       (select id from brands where slug='cellucor'), (select id from categories where slug='pre-workout');
insert into product_variants (product_id, label, sku, price_cents, stock_qty) values
  ((select id from products where slug='c4-original'),'Fruit Punch 30 doses','C4-FP-30',3990,18),
  ((select id from products where slug='c4-original'),'Icy Blue Razz 30 doses','C4-BR-30',3990,9);
insert into product_objectives (product_id, objective_id)
select (select id from products where slug='c4-original'), id from objectives where slug='energie';

-- 4) Whey Core Protein (NPL, protéines, prise de masse)
insert into products (name, slug, description, brand_id, category_id)
select 'Whey Core Protein','whey-core-protein','Protéine whey avancée enrichie en enzymes digestives.',
       (select id from brands where slug='npl'), (select id from categories where slug='proteines');
insert into product_variants (product_id, label, sku, price_cents, stock_qty) values
  ((select id from products where slug='whey-core-protein'),'Chocolat 2KG','WCP-CH-2K',4900,14),
  ((select id from products where slug='whey-core-protein'),'Chocolat 5KG','WCP-CH-5K',9900,8);
insert into product_objectives (product_id, objective_id) values
  ((select id from products where slug='whey-core-protein'),(select id from objectives where slug='prise-de-masse')),
  ((select id from products where slug='whey-core-protein'),(select id from objectives where slug='seche'));

-- 5) Ripped Whey (NPL, protéines, sèche)
insert into products (name, slug, description, brand_id, category_id)
select 'Ripped Whey','ripped-whey','Whey allégée pour une définition musculaire optimale.',
       (select id from brands where slug='npl'), (select id from categories where slug='proteines');
insert into product_variants (product_id, label, sku, price_cents, stock_qty)
select id,'Chocolat 900g','RW-CH-900',6500,12 from products where slug='ripped-whey';
insert into product_objectives (product_id, objective_id)
select (select id from products where slug='ripped-whey'), id from objectives where slug='seche';

-- 6) Shilajit (Pro HCD, santé)
insert into products (name, slug, description, brand_id, category_id)
select 'Shilajit Himalayan Health','shilajit','Shilajit himalayen 30 600mg : énergie, récupération et vitalité.',
       (select id from brands where slug='pro-hcd'), (select id from categories where slug='sante-bien-etre');
insert into product_variants (product_id, label, sku, price_cents, stock_qty)
select id,'60 gélules','SHJ-60',2900,25 from products where slug='shilajit';
insert into product_objectives (product_id, objective_id)
select (select id from products where slug='shilajit'), id from objectives where slug='sante';
