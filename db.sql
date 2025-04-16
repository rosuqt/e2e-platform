--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: employers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.employers (
    id integer NOT NULL,
    email text NOT NULL,
    password text NOT NULL
);


ALTER TABLE public.employers OWNER TO postgres;

--
-- Name: employers_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.employers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.employers_id_seq OWNER TO postgres;

--
-- Name: employers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.employers_id_seq OWNED BY public.employers.id;


--
-- Name: pending_employers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pending_employers (
    id integer NOT NULL,
    first_name character varying(255),
    last_name character varying(255),
    country_code character varying(10),
    phone character varying(15),
    email character varying(255) NOT NULL,
    password character varying(255),
    company_name character varying(255),
    company_branch character varying(255),
    company_role character varying(255),
    job_title character varying(255),
    company_email character varying(255),
    terms_accepted boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.pending_employers OWNER TO postgres;

--
-- Name: pending_employers_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pending_employers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pending_employers_id_seq OWNER TO postgres;

--
-- Name: pending_employers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pending_employers_id_seq OWNED BY public.pending_employers.id;


--
-- Name: pending_newbranches; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pending_newbranches (
    id integer NOT NULL,
    company_id integer,
    name character varying(255) NOT NULL,
    is_main_branch boolean DEFAULT false
);


ALTER TABLE public.pending_newbranches OWNER TO postgres;

--
-- Name: pending_newcompanies; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pending_newcompanies (
    id integer NOT NULL,
    company_name character varying(255) NOT NULL,
    company_branch character varying(255) NOT NULL,
    company_logo text,
    company_industry character varying(50) NOT NULL,
    email_domain character varying(255),
    company_size character varying NOT NULL,
    company_website character varying,
    country character varying(255),
    city character varying(255),
    company_email character varying(255),
    company_no character varying(12),
    address character varying(255),
    mult_branch boolean
);


ALTER TABLE public.pending_newcompanies OWNER TO postgres;

--
-- Name: personal_details; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.personal_details (
    id integer NOT NULL,
    first_name character varying(255) NOT NULL,
    last_name character varying(255) NOT NULL,
    phone character varying(15) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    country_code character varying(10) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.personal_details OWNER TO postgres;

--
-- Name: personal_details_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.personal_details_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.personal_details_id_seq OWNER TO postgres;

--
-- Name: personal_details_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.personal_details_id_seq OWNED BY public.personal_details.id;


--
-- Name: registered_branches_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.registered_branches_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.registered_branches_id_seq OWNER TO postgres;

--
-- Name: registered_branches_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.registered_branches_id_seq OWNED BY public.pending_newbranches.id;


--
-- Name: registered_companies; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.registered_companies (
    id integer NOT NULL,
    company_name character varying(255) NOT NULL,
    company_branch character varying(255) NOT NULL,
    company_logo text,
    company_industry character varying(255) NOT NULL,
    email_domain character varying(255),
    company_size character varying NOT NULL,
    company_website character varying
);


ALTER TABLE public.registered_companies OWNER TO postgres;

--
-- Name: registered_companies_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.registered_companies_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.registered_companies_id_seq OWNER TO postgres;

--
-- Name: registered_companies_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.registered_companies_id_seq OWNED BY public.registered_companies.id;


--
-- Name: registered_company_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.registered_company_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.registered_company_id_seq OWNER TO postgres;

--
-- Name: registered_company_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.registered_company_id_seq OWNED BY public.pending_newcompanies.id;


--
-- Name: registered_employers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.registered_employers (
    id integer,
    first_name character varying(255),
    last_name character varying(255),
    country_code character varying(10),
    phone character varying(15),
    email character varying(255),
    password character varying(255),
    company_name character varying(255),
    company_branch character varying(255),
    company_role character varying(255),
    job_title character varying(255),
    company_email character varying(255),
    terms_accepted boolean,
    created_at timestamp without time zone
);


ALTER TABLE public.registered_employers OWNER TO postgres;

--
-- Name: employers id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employers ALTER COLUMN id SET DEFAULT nextval('public.employers_id_seq'::regclass);


--
-- Name: pending_employers id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pending_employers ALTER COLUMN id SET DEFAULT nextval('public.pending_employers_id_seq'::regclass);


--
-- Name: pending_newbranches id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pending_newbranches ALTER COLUMN id SET DEFAULT nextval('public.registered_branches_id_seq'::regclass);


--
-- Name: pending_newcompanies id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pending_newcompanies ALTER COLUMN id SET DEFAULT nextval('public.registered_company_id_seq'::regclass);


--
-- Name: personal_details id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.personal_details ALTER COLUMN id SET DEFAULT nextval('public.personal_details_id_seq'::regclass);


--
-- Name: registered_companies id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.registered_companies ALTER COLUMN id SET DEFAULT nextval('public.registered_companies_id_seq'::regclass);


--
-- Data for Name: employers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.employers (id, email, password) FROM stdin;
\.


--
-- Data for Name: pending_employers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pending_employers (id, first_name, last_name, country_code, phone, email, password, company_name, company_branch, company_role, job_title, company_email, terms_accepted, created_at) FROM stdin;
255	aaaa	aaaa	+63	639283919443	aa3212321234234124a@mail.com	111111	\N	\N	\N	\N	\N	f	2025-04-15 00:10:47.304543
256	ally	rose	+63	639283919443	ally.rose@gmail.com	111111	newtesr	nnnnnnn	CEO	Frontend Developer	aaaaa@gmail.com	f	2025-04-15 00:17:12.277553
257	aa	wefwef	+63	639283919443	aa1232122342341sss24a@mail.com	123456	\N	\N	\N	\N	\N	f	2025-04-15 00:53:21.367912
303	aaaa	aaaa	+63	639283919443	aa123212lloldedeo234234124a@mail.com	999999	\N	\N	\N	\N	\N	f	2025-04-15 18:34:06.345204
258	wfwfwefwefwe	KweffwOlfwfwf	+63	639283919443	aa1dede2321234234124a@mail.com	123456	newtesr	nnnnnnn	CTO	Full Stack Developer	s2122swww	f	2025-04-15 01:12:12.66677
259	aaaa	aaaa	+63	639283919443	allyzarosecayer@gmail.com	123456	\N	\N	\N	\N	\N	f	2025-04-15 02:23:02.715434
260	aa	wefwef	+63	639283919443	aa123212234234124a@mail.com	123456	\N	\N	\N	\N	\N	f	2025-04-15 02:45:37.817914
305	aaaa	aaaa	+63	639283919443	aa123212loldedeo2f34234124a@mail.com	123456	\N	\N	\N	\N	\N	f	2025-04-15 19:08:19.898784
261	wfwfwefwefwe	KweffwOlfwfwf	+63	639283919443	aa1dede23aaa21234234124a@mail.com	aaaaaa	newtesr	nnnnnnn	CTO	Frontend Developer	dssd@gmail.com	f	2025-04-15 02:53:08.275116
264	aaaa	aaaa	+63	639283919443	hbuj@mail.com	aaaaaa	\N	\N	\N	\N	\N	f	2025-04-15 03:06:36.599724
265	aaaa	aaaa	+63	639283919443	aa12321wddw2234234124a@mail.com	aaaaaa	\N	\N	\N	\N	\N	f	2025-04-15 03:08:42.126966
266	aaaa	aaaa	+63	639283919443	aa12d3212234234124a@mail.com	aaaaaa	\N	\N	\N	\N	\N	f	2025-04-15 03:08:49.932674
267	aaaa	aaaa	+63	639283919443	aa123212lolo234234124a@mail.com	aaaaaa	\N	\N	\N	\N	\N	f	2025-04-15 03:09:26.965893
268	aaaa	aaaa	+63	639283919443	aa123212lolo234d234124a@mail.com	aaaaaa	\N	\N	\N	\N	\N	f	2025-04-15 03:20:00.959193
269	aaaa	aaaa	+63	639283919443	aa1232aa12lolo234234124a@mail.com	aaaaaa	\N	\N	\N	\N	\N	f	2025-04-15 03:30:01.77863
270	aaaa	aaaa	+63	639283919443	aa123212loldedeo234234124a@mail.com	123456	\N	\N	\N	\N	\N	f	2025-04-15 15:26:10.734149
271	aaaa	aaaa	+63	639283919443	aa123212loldedeo234234124a@mail.comdwew	111111	\N	\N	\N	\N	\N	f	2025-04-15 15:27:29.905075
272	aaaa	aaaa	+63	639283919443	aa1232eded12loldedeo234234124a@mail.com	123456	\N	\N	\N	\N	\N	f	2025-04-15 15:34:12.4396
275	aaaa	aaaa	+63	639283919443	aa1232esded12loldedeo234234124a@mail.com	123456	\N	\N	\N	\N	\N	f	2025-04-15 15:36:18.667645
283	aaaa	aaaa	+63	639283919443	aa123212lolo234234s124a@mail.com	123456	\N	\N	\N	\N	\N	f	2025-04-15 15:43:10.362905
292	aaaa	aaaa	+63	639283919443	aa123212loldeedeo234234124a@mail.com	123456	\N	\N	\N	\N	\N	f	2025-04-15 15:53:07.602321
293	aaaa	aaaa	+63	639283919443	aa123212lolo23sss4234124a@mail.com	123456	\N	\N	\N	\N	\N	f	2025-04-15 15:55:22.36758
295	aaaa	aaaa	+63	639283919443	aa123212sloldedeo234234124a@mail.com	123456	\N	\N	\N	\N	\N	f	2025-04-15 15:58:54.775555
308	Kemly	Kemlerina	+63	631234567890	newTest@mail.com	aaaaaa	testcompanyaaaas	testaaaaaadafa	CTO	Frontend Developer	wefwwfefw@gmail.com	f	2025-04-15 19:39:03.168019
309	Kemly	Wemly	+63	1234443323	kemly.W@mail.com	aaaaaa	qwdqwqdqwdwq1213	nnnnnnn	CTO	Frontend Developer	lol@gmail.com	f	2025-04-15 19:44:02.562105
322	aaaa	aaaa	+63	639283919443	aa123212loldedeaao234234124a@mail.com	$2b$10$Ug85EZzzflFZaVtkqgflse0LiXWkZk1WKSpX.vre8AHPR3FB1/C56	\N	\N	\N	\N	\N	f	2025-04-15 20:58:21.365661
\.


--
-- Data for Name: pending_newbranches; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pending_newbranches (id, company_id, name, is_main_branch) FROM stdin;
115	198	nnnnnnn	t
116	199	nnnnnnn	t
117	200	test	t
118	201	test	t
119	202	test	t
120	203	testaaaaaadafa	t
\.


--
-- Data for Name: pending_newcompanies; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pending_newcompanies (id, company_name, company_branch, company_logo, company_industry, email_domain, company_size, company_website, country, city, company_email, company_no, address, mult_branch) FROM stdin;
198	newtesr	nnnnnnn	\N		@momo.com		momo.com	\N	\N	\N	\N	\N	\N
199	qwdqwqdqwdwq1213	nnnnnnn	\N		@gmail-pepe.mail		lol.com	\N	\N	\N	\N	\N	\N
200	test	test	\N		@gmail-pepe.mail		lol.com	\N	\N	\N	\N	\N	\N
201	test	test	\N		@gmail-pepe.mail		lol.com	\N	\N	\N	\N	\N	\N
202	testcompany	test	\N		@wawawa.com		lol.com	\N	\N	\N	\N	\N	\N
203	testcompanyaaaas	testaaaaaadafa	\N		@momo.com		lol.com	\N	\N	\N	\N	\N	\N
\.


--
-- Data for Name: personal_details; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.personal_details (id, first_name, last_name, phone, email, password, country_code, created_at) FROM stdin;
\.


--
-- Data for Name: registered_companies; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.registered_companies (id, company_name, company_branch, company_logo, company_industry, email_domain, company_size, company_website) FROM stdin;
\.


--
-- Data for Name: registered_employers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.registered_employers (id, first_name, last_name, country_code, phone, email, password, company_name, company_branch, company_role, job_title, company_email, terms_accepted, created_at) FROM stdin;
325	ally	test	+63	9283919443	testacc@mail.com	$2b$10$AEnFsAc8C7U.YKsrSTLKKe2gQt9RlpFTbBgb976W65R1Di7XPiVSe	test	test	General Manager	Software Engineer	lo@l.com	t	2025-04-15 21:54:31.928
\.


--
-- Name: employers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.employers_id_seq', 2, true);


--
-- Name: pending_employers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pending_employers_id_seq', 325, true);


--
-- Name: personal_details_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.personal_details_id_seq', 20, true);


--
-- Name: registered_branches_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.registered_branches_id_seq', 120, true);


--
-- Name: registered_companies_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.registered_companies_id_seq', 5, true);


--
-- Name: registered_company_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.registered_company_id_seq', 203, true);


--
-- Name: employers employers_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employers
    ADD CONSTRAINT employers_email_key UNIQUE (email);


--
-- Name: employers employers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employers
    ADD CONSTRAINT employers_pkey PRIMARY KEY (id);


--
-- Name: pending_employers pending_employers_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pending_employers
    ADD CONSTRAINT pending_employers_email_key UNIQUE (email);


--
-- Name: pending_employers pending_employers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pending_employers
    ADD CONSTRAINT pending_employers_pkey PRIMARY KEY (id);


--
-- Name: personal_details personal_details_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.personal_details
    ADD CONSTRAINT personal_details_email_key UNIQUE (email);


--
-- Name: personal_details personal_details_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.personal_details
    ADD CONSTRAINT personal_details_pkey PRIMARY KEY (id);


--
-- Name: pending_newbranches registered_branches_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pending_newbranches
    ADD CONSTRAINT registered_branches_pkey PRIMARY KEY (id);


--
-- Name: registered_companies registered_companies_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.registered_companies
    ADD CONSTRAINT registered_companies_pkey PRIMARY KEY (id);


--
-- Name: pending_newcompanies registered_company_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pending_newcompanies
    ADD CONSTRAINT registered_company_pkey PRIMARY KEY (id);


--
-- Name: pending_newbranches unique_branch_per_company; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pending_newbranches
    ADD CONSTRAINT unique_branch_per_company UNIQUE (company_id, name);


--
-- Name: pending_employers unique_email; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pending_employers
    ADD CONSTRAINT unique_email UNIQUE (email);


--
-- Name: idx_main_branch_per_company; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX idx_main_branch_per_company ON public.pending_newbranches USING btree (company_id) WHERE (is_main_branch = true);


--
-- Name: one_main_branch_per_company; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX one_main_branch_per_company ON public.pending_newbranches USING btree (company_id) WHERE (is_main_branch = true);


--
-- Name: pending_newbranches fk_company_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pending_newbranches
    ADD CONSTRAINT fk_company_id FOREIGN KEY (company_id) REFERENCES public.pending_newcompanies(id) ON DELETE CASCADE;


--
-- Name: pending_newbranches registered_branches_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pending_newbranches
    ADD CONSTRAINT registered_branches_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.pending_newcompanies(id);


--
-- PostgreSQL database dump complete
--

