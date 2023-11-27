PGDMP                     
    {            test_db    15.1    15.1 0    =           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            >           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            ?           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            @           1262    32870    test_db    DATABASE     {   CREATE DATABASE test_db WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'Russian_Russia.1251';
    DROP DATABASE test_db;
                postgres    false            �            1259    41167 
   attendance    TABLE     �   CREATE TABLE public.attendance (
    id_attendance integer NOT NULL,
    id_student integer NOT NULL,
    presence integer DEFAULT 0 NOT NULL,
    id_schedule integer
);
    DROP TABLE public.attendance;
       public         heap    postgres    false            �            1259    41098 
   discipline    TABLE     j   CREATE TABLE public.discipline (
    id_discipline integer NOT NULL,
    name_discipline text NOT NULL
);
    DROP TABLE public.discipline;
       public         heap    postgres    false            �            1259    41097    discipline_id_discipline_seq    SEQUENCE     �   ALTER TABLE public.discipline ALTER COLUMN id_discipline ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.discipline_id_discipline_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    215            �            1259    41122    groups    TABLE     }   CREATE TABLE public.groups (
    id_group integer NOT NULL,
    name_group text NOT NULL,
    size_group integer NOT NULL
);
    DROP TABLE public.groups;
       public         heap    postgres    false            �            1259    41121    group_id_group_seq    SEQUENCE     �   ALTER TABLE public.groups ALTER COLUMN id_group ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.group_id_group_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    221            �            1259    41114    office    TABLE     ^   CREATE TABLE public.office (
    id_office integer NOT NULL,
    name_office text NOT NULL
);
    DROP TABLE public.office;
       public         heap    postgres    false            �            1259    41113    office_id_office_seq    SEQUENCE     �   ALTER TABLE public.office ALTER COLUMN id_office ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.office_id_office_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    219            �            1259    41130    schedule    TABLE     �   CREATE TABLE public.schedule (
    id_schedule integer NOT NULL,
    id_office integer NOT NULL,
    id_teacher integer NOT NULL,
    id_discipline integer NOT NULL,
    id_group integer NOT NULL,
    date text NOT NULL,
    "time" text NOT NULL
);
    DROP TABLE public.schedule;
       public         heap    postgres    false            �            1259    41129    schedule_id_schedule_seq    SEQUENCE     �   ALTER TABLE public.schedule ALTER COLUMN id_schedule ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.schedule_id_schedule_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    223            �            1259    57495    sensor    TABLE     �   CREATE TABLE public.sensor (
    id_sensor integer NOT NULL,
    bid_sensor integer NOT NULL,
    id_office integer NOT NULL
);
    DROP TABLE public.sensor;
       public         heap    postgres    false            �            1259    41157    student    TABLE     v   CREATE TABLE public.student (
    id_student integer NOT NULL,
    id_group integer NOT NULL,
    uid_student text
);
    DROP TABLE public.student;
       public         heap    postgres    false            �            1259    41106    teacher    TABLE     �   CREATE TABLE public.teacher (
    id_teacher integer NOT NULL,
    name_teacher text NOT NULL,
    login text NOT NULL,
    password text NOT NULL
);
    DROP TABLE public.teacher;
       public         heap    postgres    false            �            1259    41105    teacher_id_teacher_seq    SEQUENCE     �   ALTER TABLE public.teacher ALTER COLUMN id_teacher ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.teacher_id_teacher_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    217            9          0    41167 
   attendance 
   TABLE DATA           V   COPY public.attendance (id_attendance, id_student, presence, id_schedule) FROM stdin;
    public          postgres    false    225   97       /          0    41098 
   discipline 
   TABLE DATA           D   COPY public.discipline (id_discipline, name_discipline) FROM stdin;
    public          postgres    false    215   ~7       5          0    41122    groups 
   TABLE DATA           B   COPY public.groups (id_group, name_group, size_group) FROM stdin;
    public          postgres    false    221   �7       3          0    41114    office 
   TABLE DATA           8   COPY public.office (id_office, name_office) FROM stdin;
    public          postgres    false    219   8       7          0    41130    schedule 
   TABLE DATA           m   COPY public.schedule (id_schedule, id_office, id_teacher, id_discipline, id_group, date, "time") FROM stdin;
    public          postgres    false    223   78       :          0    57495    sensor 
   TABLE DATA           B   COPY public.sensor (id_sensor, bid_sensor, id_office) FROM stdin;
    public          postgres    false    226   �8       8          0    41157    student 
   TABLE DATA           D   COPY public.student (id_student, id_group, uid_student) FROM stdin;
    public          postgres    false    224   �8       1          0    41106    teacher 
   TABLE DATA           L   COPY public.teacher (id_teacher, name_teacher, login, password) FROM stdin;
    public          postgres    false    217   9       A           0    0    discipline_id_discipline_seq    SEQUENCE SET     J   SELECT pg_catalog.setval('public.discipline_id_discipline_seq', 2, true);
          public          postgres    false    214            B           0    0    group_id_group_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public.group_id_group_seq', 2, true);
          public          postgres    false    220            C           0    0    office_id_office_seq    SEQUENCE SET     B   SELECT pg_catalog.setval('public.office_id_office_seq', 1, true);
          public          postgres    false    218            D           0    0    schedule_id_schedule_seq    SEQUENCE SET     F   SELECT pg_catalog.setval('public.schedule_id_schedule_seq', 4, true);
          public          postgres    false    222            E           0    0    teacher_id_teacher_seq    SEQUENCE SET     D   SELECT pg_catalog.setval('public.teacher_id_teacher_seq', 1, true);
          public          postgres    false    216            �           2606    41172    attendance attendance_pkey 
   CONSTRAINT     c   ALTER TABLE ONLY public.attendance
    ADD CONSTRAINT attendance_pkey PRIMARY KEY (id_attendance);
 D   ALTER TABLE ONLY public.attendance DROP CONSTRAINT attendance_pkey;
       public            postgres    false    225            �           2606    41104    discipline discipline_pkey 
   CONSTRAINT     c   ALTER TABLE ONLY public.discipline
    ADD CONSTRAINT discipline_pkey PRIMARY KEY (id_discipline);
 D   ALTER TABLE ONLY public.discipline DROP CONSTRAINT discipline_pkey;
       public            postgres    false    215            �           2606    41128    groups group_pkey 
   CONSTRAINT     U   ALTER TABLE ONLY public.groups
    ADD CONSTRAINT group_pkey PRIMARY KEY (id_group);
 ;   ALTER TABLE ONLY public.groups DROP CONSTRAINT group_pkey;
       public            postgres    false    221            �           2606    41120    office office_pkey 
   CONSTRAINT     W   ALTER TABLE ONLY public.office
    ADD CONSTRAINT office_pkey PRIMARY KEY (id_office);
 <   ALTER TABLE ONLY public.office DROP CONSTRAINT office_pkey;
       public            postgres    false    219            �           2606    41136    schedule schedule_pkey 
   CONSTRAINT     ]   ALTER TABLE ONLY public.schedule
    ADD CONSTRAINT schedule_pkey PRIMARY KEY (id_schedule);
 @   ALTER TABLE ONLY public.schedule DROP CONSTRAINT schedule_pkey;
       public            postgres    false    223            �           2606    57499    sensor sensor_pkey 
   CONSTRAINT     W   ALTER TABLE ONLY public.sensor
    ADD CONSTRAINT sensor_pkey PRIMARY KEY (id_sensor);
 <   ALTER TABLE ONLY public.sensor DROP CONSTRAINT sensor_pkey;
       public            postgres    false    226            �           2606    41161    student student_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public.student
    ADD CONSTRAINT student_pkey PRIMARY KEY (id_student);
 >   ALTER TABLE ONLY public.student DROP CONSTRAINT student_pkey;
       public            postgres    false    224            �           2606    41112    teacher teacher_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public.teacher
    ADD CONSTRAINT teacher_pkey PRIMARY KEY (id_teacher);
 >   ALTER TABLE ONLY public.teacher DROP CONSTRAINT teacher_pkey;
       public            postgres    false    217            �           1259    57478    fki_schedule_fkey    INDEX     O   CREATE INDEX fki_schedule_fkey ON public.attendance USING btree (id_schedule);
 %   DROP INDEX public.fki_schedule_fkey;
       public            postgres    false    225            �           1259    57489    fki_ы    INDEX     F   CREATE INDEX "fki_ы" ON public.attendance USING btree (id_schedule);
    DROP INDEX public."fki_ы";
       public            postgres    false    225            �           2606    41147    schedule discipline_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.schedule
    ADD CONSTRAINT discipline_fkey FOREIGN KEY (id_discipline) REFERENCES public.discipline(id_discipline) ON UPDATE CASCADE ON DELETE CASCADE;
 B   ALTER TABLE ONLY public.schedule DROP CONSTRAINT discipline_fkey;
       public          postgres    false    223    215    3207            �           2606    57500    sensor fid_office    FK CONSTRAINT     �   ALTER TABLE ONLY public.sensor
    ADD CONSTRAINT fid_office FOREIGN KEY (id_office) REFERENCES public.office(id_office) ON UPDATE CASCADE ON DELETE CASCADE;
 ;   ALTER TABLE ONLY public.sensor DROP CONSTRAINT fid_office;
       public          postgres    false    226    3211    219            �           2606    41152    schedule group_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.schedule
    ADD CONSTRAINT group_fkey FOREIGN KEY (id_group) REFERENCES public.groups(id_group) ON UPDATE CASCADE ON DELETE CASCADE;
 =   ALTER TABLE ONLY public.schedule DROP CONSTRAINT group_fkey;
       public          postgres    false    223    221    3213            �           2606    41162    student group_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.student
    ADD CONSTRAINT group_fkey FOREIGN KEY (id_group) REFERENCES public.groups(id_group) ON UPDATE CASCADE ON DELETE CASCADE;
 <   ALTER TABLE ONLY public.student DROP CONSTRAINT group_fkey;
       public          postgres    false    224    3213    221            �           2606    41137    schedule office_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.schedule
    ADD CONSTRAINT office_fkey FOREIGN KEY (id_office) REFERENCES public.office(id_office) ON UPDATE CASCADE ON DELETE CASCADE;
 >   ALTER TABLE ONLY public.schedule DROP CONSTRAINT office_fkey;
       public          postgres    false    219    3211    223            �           2606    57490    attendance schedule_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.attendance
    ADD CONSTRAINT schedule_fkey FOREIGN KEY (id_schedule) REFERENCES public.schedule(id_schedule) ON UPDATE CASCADE ON DELETE CASCADE;
 B   ALTER TABLE ONLY public.attendance DROP CONSTRAINT schedule_fkey;
       public          postgres    false    225    3215    223            �           2606    41173    attendance student_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.attendance
    ADD CONSTRAINT student_fkey FOREIGN KEY (id_student) REFERENCES public.student(id_student) ON UPDATE CASCADE ON DELETE CASCADE;
 A   ALTER TABLE ONLY public.attendance DROP CONSTRAINT student_fkey;
       public          postgres    false    224    225    3217            �           2606    41142    schedule teacher_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.schedule
    ADD CONSTRAINT teacher_fkey FOREIGN KEY (id_teacher) REFERENCES public.teacher(id_teacher) ON UPDATE CASCADE ON DELETE CASCADE;
 ?   ALTER TABLE ONLY public.schedule DROP CONSTRAINT teacher_fkey;
       public          postgres    false    3209    217    223            9   5   x���	�0���0�;_����h0~$[V�(e�:�e��͉7O��M��*#      /   C   x�3�0��M�^��w\�ua��E@�}.�دpa҅�@澋�@{�t#H%W� �(�      5   1   x�3估�¤s.lT02�5�44�2�0�����B1y�F\1z\\\ ��'      3      x�3�0����+F��� `�      7   D   x�3�4�B##c]CC]CcN+CS.#�8BƄ����� &��*��fd��2��B�2�21����� ���      :      x������ � �      8   P   x�5��� k{���%26f��"��N�+$��t�r8z#��	 �����{��Ԕ��@q�Hx�֭sS�����x      1   +   x�3�0�¦.콰��&�3�.��LL��̃�\1z\\\ �y6     