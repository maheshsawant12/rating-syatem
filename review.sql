PGDMP                      }            review    17.5    17.5      D           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                           false            E           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                           false            F           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                           false            G           1262    16387    review    DATABASE     �   CREATE DATABASE review WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_United States.1252';
    DROP DATABASE review;
                     postgres    false            S           1247    16408 	   user_role    TYPE     V   CREATE TYPE public.user_role AS ENUM (
    'Admin',
    'Normal',
    'StoreOwner'
);
    DROP TYPE public.user_role;
       public               postgres    false            �            1259    16497    ratings    TABLE       CREATE TABLE public.ratings (
    id integer NOT NULL,
    user_id integer,
    store_id integer,
    rating integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT ratings_rating_check CHECK (((rating >= 1) AND (rating <= 5)))
);
    DROP TABLE public.ratings;
       public         heap r       postgres    false            �            1259    16496    ratings_id_seq    SEQUENCE     �   CREATE SEQUENCE public.ratings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 %   DROP SEQUENCE public.ratings_id_seq;
       public               postgres    false    222            H           0    0    ratings_id_seq    SEQUENCE OWNED BY     A   ALTER SEQUENCE public.ratings_id_seq OWNED BY public.ratings.id;
          public               postgres    false    221            �            1259    16480    stores    TABLE       CREATE TABLE public.stores (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    email character varying(255),
    address character varying(400),
    owner_id integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
    DROP TABLE public.stores;
       public         heap r       postgres    false            �            1259    16479    stores_id_seq    SEQUENCE     �   CREATE SEQUENCE public.stores_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 $   DROP SEQUENCE public.stores_id_seq;
       public               postgres    false    220            I           0    0    stores_id_seq    SEQUENCE OWNED BY     ?   ALTER SEQUENCE public.stores_id_seq OWNED BY public.stores.id;
          public               postgres    false    219            �            1259    16467    users    TABLE     �  CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying(60) NOT NULL,
    email character varying(255) NOT NULL,
    address character varying(400),
    password character varying(255) NOT NULL,
    role public.user_role NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    refreshtoken text DEFAULT ''::text NOT NULL,
    CONSTRAINT users_name_check CHECK (((char_length((name)::text) >= 20) AND (char_length((name)::text) <= 60)))
);
    DROP TABLE public.users;
       public         heap r       postgres    false    851            �            1259    16466    users_id_seq    SEQUENCE     �   CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.users_id_seq;
       public               postgres    false    218            J           0    0    users_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;
          public               postgres    false    217            �           2604    16500 
   ratings id    DEFAULT     h   ALTER TABLE ONLY public.ratings ALTER COLUMN id SET DEFAULT nextval('public.ratings_id_seq'::regclass);
 9   ALTER TABLE public.ratings ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    222    221    222            �           2604    16483 	   stores id    DEFAULT     f   ALTER TABLE ONLY public.stores ALTER COLUMN id SET DEFAULT nextval('public.stores_id_seq'::regclass);
 8   ALTER TABLE public.stores ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    220    219    220            �           2604    16470    users id    DEFAULT     d   ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);
 7   ALTER TABLE public.users ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    217    218    218            A          0    16497    ratings 
   TABLE DATA           L   COPY public.ratings (id, user_id, store_id, rating, created_at) FROM stdin;
    public               postgres    false    222   l%       ?          0    16480    stores 
   TABLE DATA           P   COPY public.stores (id, name, email, address, owner_id, created_at) FROM stdin;
    public               postgres    false    220   �%       =          0    16467    users 
   TABLE DATA           c   COPY public.users (id, name, email, address, password, role, created_at, refreshtoken) FROM stdin;
    public               postgres    false    218   &       K           0    0    ratings_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.ratings_id_seq', 106, true);
          public               postgres    false    221            L           0    0    stores_id_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('public.stores_id_seq', 13, true);
          public               postgres    false    219            M           0    0    users_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('public.users_id_seq', 32, true);
          public               postgres    false    217            �           2606    16504    ratings ratings_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public.ratings
    ADD CONSTRAINT ratings_pkey PRIMARY KEY (id);
 >   ALTER TABLE ONLY public.ratings DROP CONSTRAINT ratings_pkey;
       public                 postgres    false    222            �           2606    16506 $   ratings ratings_user_id_store_id_key 
   CONSTRAINT     l   ALTER TABLE ONLY public.ratings
    ADD CONSTRAINT ratings_user_id_store_id_key UNIQUE (user_id, store_id);
 N   ALTER TABLE ONLY public.ratings DROP CONSTRAINT ratings_user_id_store_id_key;
       public                 postgres    false    222    222            �           2606    16490    stores stores_email_key 
   CONSTRAINT     S   ALTER TABLE ONLY public.stores
    ADD CONSTRAINT stores_email_key UNIQUE (email);
 A   ALTER TABLE ONLY public.stores DROP CONSTRAINT stores_email_key;
       public                 postgres    false    220            �           2606    16488    stores stores_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY public.stores
    ADD CONSTRAINT stores_pkey PRIMARY KEY (id);
 <   ALTER TABLE ONLY public.stores DROP CONSTRAINT stores_pkey;
       public                 postgres    false    220            �           2606    16478    users users_email_key 
   CONSTRAINT     Q   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);
 ?   ALTER TABLE ONLY public.users DROP CONSTRAINT users_email_key;
       public                 postgres    false    218            �           2606    16476    users users_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public                 postgres    false    218            �           2606    16512    ratings ratings_store_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.ratings
    ADD CONSTRAINT ratings_store_id_fkey FOREIGN KEY (store_id) REFERENCES public.stores(id) ON DELETE CASCADE;
 G   ALTER TABLE ONLY public.ratings DROP CONSTRAINT ratings_store_id_fkey;
       public               postgres    false    222    4771    220            �           2606    16507    ratings ratings_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.ratings
    ADD CONSTRAINT ratings_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
 F   ALTER TABLE ONLY public.ratings DROP CONSTRAINT ratings_user_id_fkey;
       public               postgres    false    218    4767    222            �           2606    16491    stores stores_owner_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.stores
    ADD CONSTRAINT stores_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.users(id) ON DELETE SET NULL;
 E   ALTER TABLE ONLY public.stores DROP CONSTRAINT stores_owner_id_fkey;
       public               postgres    false    218    220    4767            A   3   x��[  �oHa��x���9��$$RZ�����7p�'K������      ?   U   x�34��,�H�Q�MMOT�M,*Q(()��,�:���%��r���&%frq�����*[XZ���Xr��qqq �oY      =   �  x���K��P���_�­p/W�����P�$�+��y�ͯ���I�jvU�*�s��d��$���.
�9)H�T�)+���DuCe춈����Y8F��3\��!�2�Vq�1a<ٞbzfR�1����������;P^94�h�!��gP��"-�$�`�s�*R\Q\���m��+(_ꗗ� ����У��s���v��iW��)F�mN�e*:�!,ZI8�ߵ�Y��T�[pbFVWD�7W,�!��"�	 ��$�U@,���^gM��z񆂅.����-62=,��A0�a�gI��� Z��LG�CG�S���i�{d�.2n�������C�U�'v�{�|����V9mWk���x�ڏx�K2����K���(�����h x��'���Ih��M;-|fg�i�.i�Q�TW�7��{'�N�=׬�e�,�g�?&��)ͲD���Q~�Q��I~��Z��l����󾳄g`;[��e�Σ�gֱ�<\��q����7=��uQ�     