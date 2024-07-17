PGDMP         ,                 {            tm_chat    14.4    14.4 4    <           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            =           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            >           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            ?           1262    114654    tm_chat    DATABASE     l   CREATE DATABASE tm_chat WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'English_United Kingdom.1252';
    DROP DATABASE tm_chat;
                postgres    false            S           1247    119547    message_status    TYPE     �   CREATE TYPE public.message_status AS ENUM (
    'pending',
    'sent',
    'received',
    'seen',
    'deleted_for_me',
    'deleted_for_all'
);
 !   DROP TYPE public.message_status;
       public          postgres    false            M           1247    119494 	   mime_type    TYPE        CREATE TYPE public.mime_type AS ENUM (
    'plaintext/*',
    'image/*',
    'video/*',
    'audio/*',
    'pdf/*',
    'docx/*',
    'emoji/*',
    'url/*',
    'phone/*',
    'ppt/*',
    'excell/*',
    'document/*',
    'aplication/*',
    'archive/*',
    'other',
    'lottie/*'
);
    DROP TYPE public.mime_type;
       public          postgres    false            D           1247    114659    usertype    TYPE     u   CREATE TYPE public.usertype AS ENUM (
    'USER',
    'ADMIN',
    'MODERATOR',
    'VIP_USER',
    'SHOP_WORKER'
);
    DROP TYPE public.usertype;
       public          postgres    false            �            1259    119526    chat    TABLE     �  CREATE TABLE public.chat (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    mime_type public.mime_type,
    message text,
    front_path text,
    to_id bigint NOT NULL,
    reply_id bigint,
    click_url text,
    message_size text,
    message_duration text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    status public.message_status,
    uuid text,
    chat_room_uuid text
);
    DROP TABLE public.chat;
       public         heap    postgres    false    845    851            �            1259    119525    chat_id_seq    SEQUENCE     t   CREATE SEQUENCE public.chat_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 "   DROP SEQUENCE public.chat_id_seq;
       public          postgres    false    216            @           0    0    chat_id_seq    SEQUENCE OWNED BY     ;   ALTER SEQUENCE public.chat_id_seq OWNED BY public.chat.id;
          public          postgres    false    215            �            1259    119828 	   chat_room    TABLE     '  CREATE TABLE public.chat_room (
    id bigint NOT NULL,
    title text,
    image text,
    user_id bigint,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    shop_slug text,
    is_used boolean DEFAULT true,
    uuid text
);
    DROP TABLE public.chat_room;
       public         heap    postgres    false            �            1259    119827    chat_room_id_seq    SEQUENCE     y   CREATE SEQUENCE public.chat_room_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public.chat_room_id_seq;
       public          postgres    false    218            A           0    0    chat_room_id_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public.chat_room_id_seq OWNED BY public.chat_room.id;
          public          postgres    false    217            �            1259    121018 
   sell_point    TABLE       CREATE TABLE public.sell_point (
    id bigint NOT NULL,
    name text NOT NULL,
    address text,
    slug text NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    phone_number text
);
    DROP TABLE public.sell_point;
       public         heap    postgres    false            �            1259    121017    shop_id_seq    SEQUENCE     t   CREATE SEQUENCE public.shop_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 "   DROP SEQUENCE public.shop_id_seq;
       public          postgres    false    220            B           0    0    shop_id_seq    SEQUENCE OWNED BY     A   ALTER SEQUENCE public.shop_id_seq OWNED BY public.sell_point.id;
          public          postgres    false    219            �            1259    119481 	   user_logs    TABLE     i  CREATE TABLE public.user_logs (
    id bigint NOT NULL,
    user_id bigint DEFAULT 0,
    endpoint text,
    full_url text,
    req_params text,
    req_query text,
    req_headers text,
    req_body text,
    req_ip text,
    req_files text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);
    DROP TABLE public.user_logs;
       public         heap    postgres    false            �            1259    119480    user_logs_id_seq    SEQUENCE     y   CREATE SEQUENCE public.user_logs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public.user_logs_id_seq;
       public          postgres    false    214            C           0    0    user_logs_id_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public.user_logs_id_seq OWNED BY public.user_logs.id;
          public          postgres    false    213            �            1259    119462    user_permission    TABLE     	  CREATE TABLE public.user_permission (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    room_uuid text,
    is_leave boolean DEFAULT false
);
 #   DROP TABLE public.user_permission;
       public         heap    postgres    false            �            1259    119461    user_permission_id_seq    SEQUENCE        CREATE SEQUENCE public.user_permission_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 -   DROP SEQUENCE public.user_permission_id_seq;
       public          postgres    false    212            D           0    0    user_permission_id_seq    SEQUENCE OWNED BY     Q   ALTER SEQUENCE public.user_permission_id_seq OWNED BY public.user_permission.id;
          public          postgres    false    211            �            1259    114655    users    TABLE     �  CREATE TABLE public.users (
    id bigint NOT NULL,
    firstname text,
    lastname text,
    username text NOT NULL,
    password text NOT NULL,
    phone_number text,
    email text,
    image text,
    uuid text,
    usertype public.usertype,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    description text,
    sell_point_uuid text,
    is_deleted boolean DEFAULT false,
    front_id text
);
    DROP TABLE public.users;
       public         heap    postgres    false    836            �            1259    114674    users_id_seq    SEQUENCE     u   CREATE SEQUENCE public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.users_id_seq;
       public          postgres    false    209            E           0    0    users_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;
          public          postgres    false    210            �           2604    119529    chat id    DEFAULT     b   ALTER TABLE ONLY public.chat ALTER COLUMN id SET DEFAULT nextval('public.chat_id_seq'::regclass);
 6   ALTER TABLE public.chat ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    215    216    216            �           2604    119831    chat_room id    DEFAULT     l   ALTER TABLE ONLY public.chat_room ALTER COLUMN id SET DEFAULT nextval('public.chat_room_id_seq'::regclass);
 ;   ALTER TABLE public.chat_room ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    218    217    218            �           2604    121021    sell_point id    DEFAULT     h   ALTER TABLE ONLY public.sell_point ALTER COLUMN id SET DEFAULT nextval('public.shop_id_seq'::regclass);
 <   ALTER TABLE public.sell_point ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    219    220    220            �           2604    119484    user_logs id    DEFAULT     l   ALTER TABLE ONLY public.user_logs ALTER COLUMN id SET DEFAULT nextval('public.user_logs_id_seq'::regclass);
 ;   ALTER TABLE public.user_logs ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    213    214    214            �           2604    119465    user_permission id    DEFAULT     x   ALTER TABLE ONLY public.user_permission ALTER COLUMN id SET DEFAULT nextval('public.user_permission_id_seq'::regclass);
 A   ALTER TABLE public.user_permission ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    212    211    212            ~           2604    114675    users id    DEFAULT     d   ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);
 7   ALTER TABLE public.users ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    210    209            5          0    119526    chat 
   TABLE DATA           �   COPY public.chat (id, user_id, mime_type, message, front_path, to_id, reply_id, click_url, message_size, message_duration, created_at, updated_at, status, uuid, chat_room_uuid) FROM stdin;
    public          postgres    false    216   4>       7          0    119828 	   chat_room 
   TABLE DATA           p   COPY public.chat_room (id, title, image, user_id, created_at, updated_at, shop_slug, is_used, uuid) FROM stdin;
    public          postgres    false    218   Q>       9          0    121018 
   sell_point 
   TABLE DATA           c   COPY public.sell_point (id, name, address, slug, created_at, updated_at, phone_number) FROM stdin;
    public          postgres    false    220   n>       3          0    119481 	   user_logs 
   TABLE DATA           �   COPY public.user_logs (id, user_id, endpoint, full_url, req_params, req_query, req_headers, req_body, req_ip, req_files, created_at, updated_at) FROM stdin;
    public          postgres    false    214   �>       1          0    119462    user_permission 
   TABLE DATA           c   COPY public.user_permission (id, user_id, created_at, updated_at, room_uuid, is_leave) FROM stdin;
    public          postgres    false    212   �>       .          0    114655    users 
   TABLE DATA           �   COPY public.users (id, firstname, lastname, username, password, phone_number, email, image, uuid, usertype, created_at, updated_at, description, sell_point_uuid, is_deleted, front_id) FROM stdin;
    public          postgres    false    209   ?       F           0    0    chat_id_seq    SEQUENCE SET     :   SELECT pg_catalog.setval('public.chat_id_seq', 1, false);
          public          postgres    false    215            G           0    0    chat_room_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.chat_room_id_seq', 1, false);
          public          postgres    false    217            H           0    0    shop_id_seq    SEQUENCE SET     9   SELECT pg_catalog.setval('public.shop_id_seq', 2, true);
          public          postgres    false    219            I           0    0    user_logs_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.user_logs_id_seq', 1, false);
          public          postgres    false    213            J           0    0    user_permission_id_seq    SEQUENCE SET     E   SELECT pg_catalog.setval('public.user_permission_id_seq', 1, false);
          public          postgres    false    211            K           0    0    users_id_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('public.users_id_seq', 837, true);
          public          postgres    false    210            �           2606    119535    chat chat_pkey 
   CONSTRAINT     L   ALTER TABLE ONLY public.chat
    ADD CONSTRAINT chat_pkey PRIMARY KEY (id);
 8   ALTER TABLE ONLY public.chat DROP CONSTRAINT chat_pkey;
       public            postgres    false    216            �           2606    119837    chat_room chat_room_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.chat_room
    ADD CONSTRAINT chat_room_pkey PRIMARY KEY (id);
 B   ALTER TABLE ONLY public.chat_room DROP CONSTRAINT chat_room_pkey;
       public            postgres    false    218            �           2606    121027    sell_point shop_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public.sell_point
    ADD CONSTRAINT shop_pkey PRIMARY KEY (id, slug);
 >   ALTER TABLE ONLY public.sell_point DROP CONSTRAINT shop_pkey;
       public            postgres    false    220    220            �           2606    119491    user_logs user_logs_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.user_logs
    ADD CONSTRAINT user_logs_pkey PRIMARY KEY (id);
 B   ALTER TABLE ONLY public.user_logs DROP CONSTRAINT user_logs_pkey;
       public            postgres    false    214            �           2606    119469 $   user_permission user_permission_pkey 
   CONSTRAINT     b   ALTER TABLE ONLY public.user_permission
    ADD CONSTRAINT user_permission_pkey PRIMARY KEY (id);
 N   ALTER TABLE ONLY public.user_permission DROP CONSTRAINT user_permission_pkey;
       public            postgres    false    212            �           2606    114685    users users_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public            postgres    false    209            �           2606    119536    chat sender    FK CONSTRAINT     j   ALTER TABLE ONLY public.chat
    ADD CONSTRAINT sender FOREIGN KEY (user_id) REFERENCES public.users(id);
 5   ALTER TABLE ONLY public.chat DROP CONSTRAINT sender;
       public          postgres    false    3221    209    216            �           2606    119470    user_permission to_user    FK CONSTRAINT     �   ALTER TABLE ONLY public.user_permission
    ADD CONSTRAINT to_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
 A   ALTER TABLE ONLY public.user_permission DROP CONSTRAINT to_user;
       public          postgres    false    209    3221    212            �           2606    119838    chat_room to_user    FK CONSTRAINT     �   ALTER TABLE ONLY public.chat_room
    ADD CONSTRAINT to_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
 ;   ALTER TABLE ONLY public.chat_room DROP CONSTRAINT to_user;
       public          postgres    false    3221    209    218            5      x������ � �      7      x������ � �      9   ^   x�}�;� �N��bط*B��06kb�%����v`�-kV3m�֢���9v]���]�N��51��;� nK�a��WU��#H `��Z���k      3      x������ � �      1      x������ � �      .   �  x��S]o�0}���iN��?�J5:Zm-����������A��~�쐠2��O�-�s�=��ǚPg:��yX��oGQrt����J��ǷAs4x6��N�ɾ��9�^��R\?t&p���hu�|	&A1 �"����-Y����4���h6u��1ZO�"k��e�d�U��$��٦�D�AP�n��ˢ�fE��j6�뵿f�l>n!�iݓ�y2*�$n�����~:��;G��L`��g5O�_�"Cfz�� Hp�H8E�ʢ%b�����[pǰ�ݵ����K�A�ÖԎK����4�ݕ�%�-"vV�*{�  Ӏ`~�����v4u�Y�6-f�[���)����jkh_��Ii�$	Q�H)�qH��$�8�Tǉ)��e�{v��o �<"<Fe- -�}�d|�y�r(0'5��u�x:y�;�l�%��]q!�^!7��C4X��}҂����Y�Sq����]��DC����l3�)��8�4��U����5�Yۜ��W[~���U�^^L�	��ts%����s�QSU���t�%�Jގc �j���&�f��x3���-�|)STzU��+	�k �#X��Zcߒ�� yp�#
�RF*񴎸p&Ҁ�����t/{WU��G�ТAK(�&���e�����h4� {2i�     