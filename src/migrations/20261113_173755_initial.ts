import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."_locales" AS ENUM('en');
  CREATE TYPE "public"."enum_works_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__works_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__works_v_published_locale" AS ENUM('en');
  CREATE TYPE "public"."enum_writings_category" AS ENUM('poetry', 'prose', 'essay', 'screenwriting', 'other');
  CREATE TYPE "public"."enum_writings_attachment_visibility" AS ENUM('private', 'public');
  CREATE TYPE "public"."enum_writings_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__writings_v_version_category" AS ENUM('poetry', 'prose', 'essay', 'screenwriting', 'other');
  CREATE TYPE "public"."enum__writings_v_version_attachment_visibility" AS ENUM('private', 'public');
  CREATE TYPE "public"."enum__writings_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__writings_v_published_locale" AS ENUM('en');
  CREATE TYPE "public"."enum_awards_recognition" AS ENUM('official-selection', 'nominee', 'winner', 'honourable-mention', 'other');
  CREATE TYPE "public"."enum_awards_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__awards_v_version_recognition" AS ENUM('official-selection', 'nominee', 'winner', 'honourable-mention', 'other');
  CREATE TYPE "public"."enum__awards_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__awards_v_published_locale" AS ENUM('en');
  CREATE TYPE "public"."enum_news_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__news_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__news_v_published_locale" AS ENUM('en');
  CREATE TYPE "public"."enum_legal_pages_page_type" AS ENUM('privacy', 'cookies', 'terms', 'copyright', 'accessibility');
  CREATE TYPE "public"."enum_legal_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__legal_pages_v_version_page_type" AS ENUM('privacy', 'cookies', 'terms', 'copyright', 'accessibility');
  CREATE TYPE "public"."enum__legal_pages_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__legal_pages_v_published_locale" AS ENUM('en');
  CREATE TYPE "public"."enum_contact_messages_status" AS ENUM('new', 'read', 'replied', 'archived');
  CREATE TYPE "public"."enum_payload_llm_instructions_entity_type" AS ENUM('collection', 'global');
  CREATE TYPE "public"."enum_homepage_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__homepage_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__homepage_v_published_locale" AS ENUM('en');
  CREATE TYPE "public"."enum_biography_portrait_position" AS ENUM('center', 'top', 'bottom');
  CREATE TYPE "public"."enum_biography_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__biography_v_version_portrait_position" AS ENUM('center', 'top', 'bottom');
  CREATE TYPE "public"."enum__biography_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__biography_v_published_locale" AS ENUM('en');
  CREATE TYPE "public"."enum_contact_settings_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__contact_settings_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__contact_settings_v_published_locale" AS ENUM('en');
  CREATE TYPE "public"."enum_website_settings_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__website_settings_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__website_settings_v_published_locale" AS ENUM('en');
  CREATE TABLE "admins_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "admins" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"reset_password_requested_at" timestamp(3) with time zone,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "admins_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" integer
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"caption" varchar,
  	"related_film_id" integer,
  	"_h_folders_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"original_filename" varchar,
  	"original_url" varchar,
  	"original_mime_type" varchar,
  	"original_filesize" numeric,
  	"original_width" numeric,
  	"original_height" numeric,
  	"original_prefix" varchar,
  	"original__objectkey" varchar,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "media_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"tags_id" integer,
  	"admins_id" integer
  );
  
  CREATE TABLE "_media_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_alt" varchar NOT NULL,
  	"version_caption" varchar,
  	"version_related_film_id" integer,
  	"version__h_folders_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version_url" varchar,
  	"version_thumbnail_u_r_l" varchar,
  	"version_filename" varchar,
  	"version_mime_type" varchar,
  	"version_filesize" numeric,
  	"version_width" numeric,
  	"version_height" numeric,
  	"version_original_filename" varchar,
  	"version_original_url" varchar,
  	"version_original_mime_type" varchar,
  	"version_original_filesize" numeric,
  	"version_original_width" numeric,
  	"version_original_height" numeric,
  	"version_original_prefix" varchar,
  	"version_original__objectkey" varchar,
  	"version_focal_x" numeric,
  	"version_focal_y" numeric,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_media_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"tags_id" integer,
  	"admins_id" integer
  );
  
  CREATE TABLE "private_media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"description" varchar,
  	"related_film_id" integer,
  	"copyright_owner" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"original_filename" varchar,
  	"original_url" varchar,
  	"original_mime_type" varchar,
  	"original_filesize" numeric,
  	"original_width" numeric,
  	"original_height" numeric,
  	"original_prefix" varchar,
  	"original__objectkey" varchar,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "private_media_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" integer
  );
  
  CREATE TABLE "folders" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_h_folders_id" integer,
  	"name" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "folders_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" integer
  );
  
  CREATE TABLE "_folders_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version__h_folders_id" integer,
  	"version_name" varchar NOT NULL,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_folders_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" integer
  );
  
  CREATE TABLE "tags" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_h_tags_id" integer,
  	"name" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "tags_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" integer
  );
  
  CREATE TABLE "_tags_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version__h_tags_id" integer,
  	"version_name" varchar NOT NULL,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_tags_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" integer
  );
  
  CREATE TABLE "works_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar
  );
  
  CREATE TABLE "works_awards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "works_credits" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" varchar
  );
  
  CREATE TABLE "works" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_order" varchar,
  	"title" varchar,
  	"slug" varchar,
  	"poster_id" integer,
  	"year" varchar,
  	"type" varchar,
  	"status" varchar,
  	"duration" varchar,
  	"synopsis" varchar,
  	"description" varchar,
  	"trailer_url" varchar,
  	"trailer_file_id" integer,
  	"additional_information" varchar,
  	"featured" boolean DEFAULT false,
  	"sort_order" numeric DEFAULT 0,
  	"archived" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_works_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "works_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"private_media_id" integer,
  	"admins_id" integer
  );
  
  CREATE TABLE "_works_v_version_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_works_v_version_awards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_works_v_version_credits" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_works_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version__order" varchar,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_poster_id" integer,
  	"version_year" varchar,
  	"version_type" varchar,
  	"version_status" varchar,
  	"version_duration" varchar,
  	"version_synopsis" varchar,
  	"version_description" varchar,
  	"version_trailer_url" varchar,
  	"version_trailer_file_id" integer,
  	"version_additional_information" varchar,
  	"version_featured" boolean DEFAULT false,
  	"version_sort_order" numeric DEFAULT 0,
  	"version_archived" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__works_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"published_locale" "enum__works_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_works_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"private_media_id" integer,
  	"admins_id" integer
  );
  
  CREATE TABLE "writings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"subtitle" varchar,
  	"category" "enum_writings_category" DEFAULT 'poetry',
  	"body" jsonb,
  	"author" varchar DEFAULT 'Kassandra Stanley Shostle',
  	"publication_date" timestamp(3) with time zone,
  	"featured_image_id" integer,
  	"publication_credit" varchar,
  	"external_link" varchar,
  	"attachment_id" integer,
  	"attachment_visibility" "enum_writings_attachment_visibility" DEFAULT 'private',
  	"slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_writings_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "writings_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" integer
  );
  
  CREATE TABLE "_writings_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_subtitle" varchar,
  	"version_category" "enum__writings_v_version_category" DEFAULT 'poetry',
  	"version_body" jsonb,
  	"version_author" varchar DEFAULT 'Kassandra Stanley Shostle',
  	"version_publication_date" timestamp(3) with time zone,
  	"version_featured_image_id" integer,
  	"version_publication_credit" varchar,
  	"version_external_link" varchar,
  	"version_attachment_id" integer,
  	"version_attachment_visibility" "enum__writings_v_version_attachment_visibility" DEFAULT 'private',
  	"version_slug" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__writings_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"published_locale" "enum__writings_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_writings_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" integer
  );
  
  CREATE TABLE "writing_files" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"description" varchar,
  	"is_public" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"original_filename" varchar,
  	"original_url" varchar,
  	"original_mime_type" varchar,
  	"original_filesize" numeric,
  	"original_width" numeric,
  	"original_height" numeric,
  	"original_prefix" varchar,
  	"original__objectkey" varchar,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "writing_files_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" integer
  );
  
  CREATE TABLE "awards" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_order" varchar,
  	"festival_name" varchar,
  	"location" varchar,
  	"year" varchar,
  	"recognition" "enum_awards_recognition",
  	"custom_recognition" varchar,
  	"award_name" varchar,
  	"result" varchar,
  	"laurel_id" integer,
  	"image_id" integer,
  	"film_id" integer,
  	"show_on_film_page" boolean DEFAULT true,
  	"website" varchar,
  	"sort_order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_awards_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "awards_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" integer
  );
  
  CREATE TABLE "_awards_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version__order" varchar,
  	"version_festival_name" varchar,
  	"version_location" varchar,
  	"version_year" varchar,
  	"version_recognition" "enum__awards_v_version_recognition",
  	"version_custom_recognition" varchar,
  	"version_award_name" varchar,
  	"version_result" varchar,
  	"version_laurel_id" integer,
  	"version_image_id" integer,
  	"version_film_id" integer,
  	"version_show_on_film_page" boolean DEFAULT true,
  	"version_website" varchar,
  	"version_sort_order" numeric DEFAULT 0,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__awards_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"published_locale" "enum__awards_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_awards_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" integer
  );
  
  CREATE TABLE "news" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_order" varchar,
  	"headline" varchar,
  	"slug" varchar,
  	"main_image_id" integer,
  	"summary" varchar,
  	"body" varchar,
  	"date" timestamp(3) with time zone,
  	"related_film_id" integer,
  	"featured" boolean DEFAULT false,
  	"sort_order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_news_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "news_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" integer
  );
  
  CREATE TABLE "_news_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version__order" varchar,
  	"version_headline" varchar,
  	"version_slug" varchar,
  	"version_main_image_id" integer,
  	"version_summary" varchar,
  	"version_body" varchar,
  	"version_date" timestamp(3) with time zone,
  	"version_related_film_id" integer,
  	"version_featured" boolean DEFAULT false,
  	"version_sort_order" numeric DEFAULT 0,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__news_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"published_locale" "enum__news_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_news_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" integer
  );
  
  CREATE TABLE "legal_pages_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"body" varchar
  );
  
  CREATE TABLE "legal_pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"page_type" "enum_legal_pages_page_type",
  	"introduction" varchar,
  	"review_required" boolean DEFAULT true,
  	"last_reviewed" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_legal_pages_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "legal_pages_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" integer
  );
  
  CREATE TABLE "_legal_pages_v_version_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"body" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_legal_pages_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_page_type" "enum__legal_pages_v_version_page_type",
  	"version_introduction" varchar,
  	"version_review_required" boolean DEFAULT true,
  	"version_last_reviewed" timestamp(3) with time zone,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__legal_pages_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"published_locale" "enum__legal_pages_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_legal_pages_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" integer
  );
  
  CREATE TABLE "contact_messages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"message" varchar NOT NULL,
  	"status" "enum_contact_messages_status" DEFAULT 'new',
  	"delete_after" timestamp(3) with time zone,
  	"source_i_p" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "contact_messages_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" integer
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" integer,
  	"media_id" integer,
  	"private_media_id" integer,
  	"folders_id" integer,
  	"tags_id" integer,
  	"works_id" integer,
  	"writings_id" integer,
  	"writing_files_id" integer,
  	"awards_id" integer,
  	"news_id" integer,
  	"legal_pages_id" integer,
  	"contact_messages_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_llm_instructions" (
  	"id" varchar PRIMARY KEY NOT NULL,
  	"entity_slug" varchar NOT NULL,
  	"entity_type" "enum_payload_llm_instructions_entity_type" NOT NULL,
  	"additional_instructions" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_llm_instructions_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" varchar NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" integer
  );
  
  CREATE TABLE "homepage_hero_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer
  );
  
  CREATE TABLE "homepage" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"featured_film_id" integer,
  	"featured_video_id" integer,
  	"supporting_text" varchar,
  	"_status" "enum_homepage_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "homepage_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" integer
  );
  
  CREATE TABLE "_homepage_v_version_hero_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_homepage_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_featured_film_id" integer,
  	"version_featured_video_id" integer,
  	"version_supporting_text" varchar,
  	"version__status" "enum__homepage_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"published_locale" "enum__homepage_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_homepage_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" integer
  );
  
  CREATE TABLE "biography_about_chapters" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"body" varchar
  );
  
  CREATE TABLE "biography" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"roles" varchar,
  	"short_biography" varchar,
  	"full_biography" varchar,
  	"about_standfirst" varchar,
  	"about_opening" varchar,
  	"about_quote" varchar,
  	"portrait_id" integer,
  	"portrait_position" "enum_biography_portrait_position" DEFAULT 'center',
  	"_status" "enum_biography_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "biography_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" integer
  );
  
  CREATE TABLE "_biography_v_version_about_chapters" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"body" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_biography_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_roles" varchar,
  	"version_short_biography" varchar,
  	"version_full_biography" varchar,
  	"version_about_standfirst" varchar,
  	"version_about_opening" varchar,
  	"version_about_quote" varchar,
  	"version_portrait_id" integer,
  	"version_portrait_position" "enum__biography_v_version_portrait_position" DEFAULT 'center',
  	"version__status" "enum__biography_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"published_locale" "enum__biography_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_biography_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" integer
  );
  
  CREATE TABLE "contact_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"introduction" varchar,
  	"email" varchar,
  	"show_email" boolean DEFAULT false,
  	"telephone" varchar,
  	"show_telephone" boolean DEFAULT false,
  	"allow_form" boolean DEFAULT false,
  	"message_retention_days" numeric DEFAULT 180,
  	"_status" "enum_contact_settings_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "contact_settings_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" integer
  );
  
  CREATE TABLE "_contact_settings_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_introduction" varchar,
  	"version_email" varchar,
  	"version_show_email" boolean DEFAULT false,
  	"version_telephone" varchar,
  	"version_show_telephone" boolean DEFAULT false,
  	"version_allow_form" boolean DEFAULT false,
  	"version_message_retention_days" numeric DEFAULT 180,
  	"version__status" "enum__contact_settings_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"published_locale" "enum__contact_settings_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_contact_settings_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" integer
  );
  
  CREATE TABLE "website_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"site_description" varchar,
  	"privacy_contact_email" varchar,
  	"_status" "enum_website_settings_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "website_settings_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" integer
  );
  
  CREATE TABLE "_website_settings_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_site_description" varchar,
  	"version_privacy_contact_email" varchar,
  	"version__status" "enum__website_settings_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"published_locale" "enum__website_settings_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_website_settings_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" integer
  );
  
  ALTER TABLE "admins_sessions" ADD CONSTRAINT "admins_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "admins_rels" ADD CONSTRAINT "admins_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "admins_rels" ADD CONSTRAINT "admins_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "media" ADD CONSTRAINT "media_related_film_id_works_id_fk" FOREIGN KEY ("related_film_id") REFERENCES "public"."works"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "media" ADD CONSTRAINT "media__h_folders_id_folders_id_fk" FOREIGN KEY ("_h_folders_id") REFERENCES "public"."folders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "media_rels" ADD CONSTRAINT "media_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "media_rels" ADD CONSTRAINT "media_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "media_rels" ADD CONSTRAINT "media_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_media_v" ADD CONSTRAINT "_media_v_parent_id_media_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_media_v" ADD CONSTRAINT "_media_v_version_related_film_id_works_id_fk" FOREIGN KEY ("version_related_film_id") REFERENCES "public"."works"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_media_v" ADD CONSTRAINT "_media_v_version__h_folders_id_folders_id_fk" FOREIGN KEY ("version__h_folders_id") REFERENCES "public"."folders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_media_v_rels" ADD CONSTRAINT "_media_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_media_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_media_v_rels" ADD CONSTRAINT "_media_v_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_media_v_rels" ADD CONSTRAINT "_media_v_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "private_media" ADD CONSTRAINT "private_media_related_film_id_works_id_fk" FOREIGN KEY ("related_film_id") REFERENCES "public"."works"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "private_media_rels" ADD CONSTRAINT "private_media_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."private_media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "private_media_rels" ADD CONSTRAINT "private_media_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "folders" ADD CONSTRAINT "folders__h_folders_id_folders_id_fk" FOREIGN KEY ("_h_folders_id") REFERENCES "public"."folders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "folders_rels" ADD CONSTRAINT "folders_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."folders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "folders_rels" ADD CONSTRAINT "folders_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_folders_v" ADD CONSTRAINT "_folders_v_parent_id_folders_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."folders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_folders_v" ADD CONSTRAINT "_folders_v_version__h_folders_id_folders_id_fk" FOREIGN KEY ("version__h_folders_id") REFERENCES "public"."folders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_folders_v_rels" ADD CONSTRAINT "_folders_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_folders_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_folders_v_rels" ADD CONSTRAINT "_folders_v_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tags" ADD CONSTRAINT "tags__h_tags_id_tags_id_fk" FOREIGN KEY ("_h_tags_id") REFERENCES "public"."tags"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "tags_rels" ADD CONSTRAINT "tags_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tags_rels" ADD CONSTRAINT "tags_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_tags_v" ADD CONSTRAINT "_tags_v_parent_id_tags_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."tags"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_tags_v" ADD CONSTRAINT "_tags_v_version__h_tags_id_tags_id_fk" FOREIGN KEY ("version__h_tags_id") REFERENCES "public"."tags"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_tags_v_rels" ADD CONSTRAINT "_tags_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_tags_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_tags_v_rels" ADD CONSTRAINT "_tags_v_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "works_gallery" ADD CONSTRAINT "works_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "works_gallery" ADD CONSTRAINT "works_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."works"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "works_awards" ADD CONSTRAINT "works_awards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."works"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "works_credits" ADD CONSTRAINT "works_credits_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."works"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "works" ADD CONSTRAINT "works_poster_id_media_id_fk" FOREIGN KEY ("poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "works" ADD CONSTRAINT "works_trailer_file_id_media_id_fk" FOREIGN KEY ("trailer_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "works_rels" ADD CONSTRAINT "works_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."works"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "works_rels" ADD CONSTRAINT "works_rels_private_media_fk" FOREIGN KEY ("private_media_id") REFERENCES "public"."private_media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "works_rels" ADD CONSTRAINT "works_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_works_v_version_gallery" ADD CONSTRAINT "_works_v_version_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_works_v_version_gallery" ADD CONSTRAINT "_works_v_version_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_works_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_works_v_version_awards" ADD CONSTRAINT "_works_v_version_awards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_works_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_works_v_version_credits" ADD CONSTRAINT "_works_v_version_credits_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_works_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_works_v" ADD CONSTRAINT "_works_v_parent_id_works_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."works"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_works_v" ADD CONSTRAINT "_works_v_version_poster_id_media_id_fk" FOREIGN KEY ("version_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_works_v" ADD CONSTRAINT "_works_v_version_trailer_file_id_media_id_fk" FOREIGN KEY ("version_trailer_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_works_v_rels" ADD CONSTRAINT "_works_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_works_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_works_v_rels" ADD CONSTRAINT "_works_v_rels_private_media_fk" FOREIGN KEY ("private_media_id") REFERENCES "public"."private_media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_works_v_rels" ADD CONSTRAINT "_works_v_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "writings" ADD CONSTRAINT "writings_featured_image_id_media_id_fk" FOREIGN KEY ("featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "writings" ADD CONSTRAINT "writings_attachment_id_writing_files_id_fk" FOREIGN KEY ("attachment_id") REFERENCES "public"."writing_files"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "writings_rels" ADD CONSTRAINT "writings_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."writings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "writings_rels" ADD CONSTRAINT "writings_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_writings_v" ADD CONSTRAINT "_writings_v_parent_id_writings_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."writings"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_writings_v" ADD CONSTRAINT "_writings_v_version_featured_image_id_media_id_fk" FOREIGN KEY ("version_featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_writings_v" ADD CONSTRAINT "_writings_v_version_attachment_id_writing_files_id_fk" FOREIGN KEY ("version_attachment_id") REFERENCES "public"."writing_files"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_writings_v_rels" ADD CONSTRAINT "_writings_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_writings_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_writings_v_rels" ADD CONSTRAINT "_writings_v_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "writing_files_rels" ADD CONSTRAINT "writing_files_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."writing_files"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "writing_files_rels" ADD CONSTRAINT "writing_files_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "awards" ADD CONSTRAINT "awards_laurel_id_media_id_fk" FOREIGN KEY ("laurel_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "awards" ADD CONSTRAINT "awards_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "awards" ADD CONSTRAINT "awards_film_id_works_id_fk" FOREIGN KEY ("film_id") REFERENCES "public"."works"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "awards_rels" ADD CONSTRAINT "awards_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."awards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "awards_rels" ADD CONSTRAINT "awards_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_awards_v" ADD CONSTRAINT "_awards_v_parent_id_awards_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."awards"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_awards_v" ADD CONSTRAINT "_awards_v_version_laurel_id_media_id_fk" FOREIGN KEY ("version_laurel_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_awards_v" ADD CONSTRAINT "_awards_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_awards_v" ADD CONSTRAINT "_awards_v_version_film_id_works_id_fk" FOREIGN KEY ("version_film_id") REFERENCES "public"."works"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_awards_v_rels" ADD CONSTRAINT "_awards_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_awards_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_awards_v_rels" ADD CONSTRAINT "_awards_v_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "news" ADD CONSTRAINT "news_main_image_id_media_id_fk" FOREIGN KEY ("main_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "news" ADD CONSTRAINT "news_related_film_id_works_id_fk" FOREIGN KEY ("related_film_id") REFERENCES "public"."works"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "news_rels" ADD CONSTRAINT "news_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."news"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "news_rels" ADD CONSTRAINT "news_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_news_v" ADD CONSTRAINT "_news_v_parent_id_news_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."news"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_news_v" ADD CONSTRAINT "_news_v_version_main_image_id_media_id_fk" FOREIGN KEY ("version_main_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_news_v" ADD CONSTRAINT "_news_v_version_related_film_id_works_id_fk" FOREIGN KEY ("version_related_film_id") REFERENCES "public"."works"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_news_v_rels" ADD CONSTRAINT "_news_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_news_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_news_v_rels" ADD CONSTRAINT "_news_v_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "legal_pages_sections" ADD CONSTRAINT "legal_pages_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."legal_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "legal_pages_rels" ADD CONSTRAINT "legal_pages_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."legal_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "legal_pages_rels" ADD CONSTRAINT "legal_pages_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_legal_pages_v_version_sections" ADD CONSTRAINT "_legal_pages_v_version_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_legal_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_legal_pages_v" ADD CONSTRAINT "_legal_pages_v_parent_id_legal_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."legal_pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_legal_pages_v_rels" ADD CONSTRAINT "_legal_pages_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_legal_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_legal_pages_v_rels" ADD CONSTRAINT "_legal_pages_v_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contact_messages_rels" ADD CONSTRAINT "contact_messages_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."contact_messages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contact_messages_rels" ADD CONSTRAINT "contact_messages_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_private_media_fk" FOREIGN KEY ("private_media_id") REFERENCES "public"."private_media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_folders_fk" FOREIGN KEY ("folders_id") REFERENCES "public"."folders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_works_fk" FOREIGN KEY ("works_id") REFERENCES "public"."works"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_writings_fk" FOREIGN KEY ("writings_id") REFERENCES "public"."writings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_writing_files_fk" FOREIGN KEY ("writing_files_id") REFERENCES "public"."writing_files"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_awards_fk" FOREIGN KEY ("awards_id") REFERENCES "public"."awards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_news_fk" FOREIGN KEY ("news_id") REFERENCES "public"."news"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_legal_pages_fk" FOREIGN KEY ("legal_pages_id") REFERENCES "public"."legal_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_contact_messages_fk" FOREIGN KEY ("contact_messages_id") REFERENCES "public"."contact_messages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_llm_instructions_rels" ADD CONSTRAINT "payload_llm_instructions_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_llm_instructions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_llm_instructions_rels" ADD CONSTRAINT "payload_llm_instructions_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_hero_images" ADD CONSTRAINT "homepage_hero_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage_hero_images" ADD CONSTRAINT "homepage_hero_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage" ADD CONSTRAINT "homepage_featured_film_id_works_id_fk" FOREIGN KEY ("featured_film_id") REFERENCES "public"."works"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage" ADD CONSTRAINT "homepage_featured_video_id_media_id_fk" FOREIGN KEY ("featured_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage_rels" ADD CONSTRAINT "homepage_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_rels" ADD CONSTRAINT "homepage_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_version_hero_images" ADD CONSTRAINT "_homepage_v_version_hero_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_homepage_v_version_hero_images" ADD CONSTRAINT "_homepage_v_version_hero_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v" ADD CONSTRAINT "_homepage_v_version_featured_film_id_works_id_fk" FOREIGN KEY ("version_featured_film_id") REFERENCES "public"."works"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_homepage_v" ADD CONSTRAINT "_homepage_v_version_featured_video_id_media_id_fk" FOREIGN KEY ("version_featured_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_homepage_v_rels" ADD CONSTRAINT "_homepage_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_rels" ADD CONSTRAINT "_homepage_v_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "biography_about_chapters" ADD CONSTRAINT "biography_about_chapters_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."biography"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "biography" ADD CONSTRAINT "biography_portrait_id_media_id_fk" FOREIGN KEY ("portrait_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "biography_rels" ADD CONSTRAINT "biography_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."biography"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "biography_rels" ADD CONSTRAINT "biography_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_biography_v_version_about_chapters" ADD CONSTRAINT "_biography_v_version_about_chapters_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_biography_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_biography_v" ADD CONSTRAINT "_biography_v_version_portrait_id_media_id_fk" FOREIGN KEY ("version_portrait_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_biography_v_rels" ADD CONSTRAINT "_biography_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_biography_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_biography_v_rels" ADD CONSTRAINT "_biography_v_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contact_settings_rels" ADD CONSTRAINT "contact_settings_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."contact_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contact_settings_rels" ADD CONSTRAINT "contact_settings_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_contact_settings_v_rels" ADD CONSTRAINT "_contact_settings_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_contact_settings_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_contact_settings_v_rels" ADD CONSTRAINT "_contact_settings_v_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "website_settings_rels" ADD CONSTRAINT "website_settings_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."website_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "website_settings_rels" ADD CONSTRAINT "website_settings_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_website_settings_v_rels" ADD CONSTRAINT "_website_settings_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_website_settings_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_website_settings_v_rels" ADD CONSTRAINT "_website_settings_v_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "admins_sessions_order_idx" ON "admins_sessions" USING btree ("_order");
  CREATE INDEX "admins_sessions_parent_id_idx" ON "admins_sessions" USING btree ("_parent_id");
  CREATE INDEX "admins_updated_at_idx" ON "admins" USING btree ("updated_at");
  CREATE INDEX "admins_created_at_idx" ON "admins" USING btree ("created_at");
  CREATE UNIQUE INDEX "admins_email_idx" ON "admins" USING btree ("email");
  CREATE INDEX "admins_rels_order_idx" ON "admins_rels" USING btree ("order");
  CREATE INDEX "admins_rels_parent_idx" ON "admins_rels" USING btree ("parent_id");
  CREATE INDEX "admins_rels_path_idx" ON "admins_rels" USING btree ("path");
  CREATE INDEX "admins_rels_admins_id_idx" ON "admins_rels" USING btree ("admins_id");
  CREATE INDEX "media_related_film_idx" ON "media" USING btree ("related_film_id");
  CREATE INDEX "media__h_folders_idx" ON "media" USING btree ("_h_folders_id");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_original_original_filename_idx" ON "media" USING btree ("original_filename");
  CREATE INDEX "media_rels_order_idx" ON "media_rels" USING btree ("order");
  CREATE INDEX "media_rels_parent_idx" ON "media_rels" USING btree ("parent_id");
  CREATE INDEX "media_rels_path_idx" ON "media_rels" USING btree ("path");
  CREATE INDEX "media_rels_tags_id_idx" ON "media_rels" USING btree ("tags_id");
  CREATE INDEX "media_rels_admins_id_idx" ON "media_rels" USING btree ("admins_id");
  CREATE INDEX "_media_v_parent_idx" ON "_media_v" USING btree ("parent_id");
  CREATE INDEX "_media_v_version_version_related_film_idx" ON "_media_v" USING btree ("version_related_film_id");
  CREATE INDEX "_media_v_version_version__h_folders_idx" ON "_media_v" USING btree ("version__h_folders_id");
  CREATE INDEX "_media_v_version_version_updated_at_idx" ON "_media_v" USING btree ("version_updated_at");
  CREATE INDEX "_media_v_version_version_created_at_idx" ON "_media_v" USING btree ("version_created_at");
  CREATE INDEX "_media_v_version_version_filename_idx" ON "_media_v" USING btree ("version_filename");
  CREATE INDEX "_media_v_version_original_version_original_filename_idx" ON "_media_v" USING btree ("version_original_filename");
  CREATE INDEX "_media_v_created_at_idx" ON "_media_v" USING btree ("created_at");
  CREATE INDEX "_media_v_updated_at_idx" ON "_media_v" USING btree ("updated_at");
  CREATE INDEX "_media_v_rels_order_idx" ON "_media_v_rels" USING btree ("order");
  CREATE INDEX "_media_v_rels_parent_idx" ON "_media_v_rels" USING btree ("parent_id");
  CREATE INDEX "_media_v_rels_path_idx" ON "_media_v_rels" USING btree ("path");
  CREATE INDEX "_media_v_rels_tags_id_idx" ON "_media_v_rels" USING btree ("tags_id");
  CREATE INDEX "_media_v_rels_admins_id_idx" ON "_media_v_rels" USING btree ("admins_id");
  CREATE INDEX "private_media_related_film_idx" ON "private_media" USING btree ("related_film_id");
  CREATE INDEX "private_media_updated_at_idx" ON "private_media" USING btree ("updated_at");
  CREATE INDEX "private_media_created_at_idx" ON "private_media" USING btree ("created_at");
  CREATE UNIQUE INDEX "private_media_filename_idx" ON "private_media" USING btree ("filename");
  CREATE INDEX "private_media_original_original_filename_idx" ON "private_media" USING btree ("original_filename");
  CREATE INDEX "private_media_rels_order_idx" ON "private_media_rels" USING btree ("order");
  CREATE INDEX "private_media_rels_parent_idx" ON "private_media_rels" USING btree ("parent_id");
  CREATE INDEX "private_media_rels_path_idx" ON "private_media_rels" USING btree ("path");
  CREATE INDEX "private_media_rels_admins_id_idx" ON "private_media_rels" USING btree ("admins_id");
  CREATE INDEX "folders__h_folders_idx" ON "folders" USING btree ("_h_folders_id");
  CREATE INDEX "folders_updated_at_idx" ON "folders" USING btree ("updated_at");
  CREATE INDEX "folders_created_at_idx" ON "folders" USING btree ("created_at");
  CREATE INDEX "folders_rels_order_idx" ON "folders_rels" USING btree ("order");
  CREATE INDEX "folders_rels_parent_idx" ON "folders_rels" USING btree ("parent_id");
  CREATE INDEX "folders_rels_path_idx" ON "folders_rels" USING btree ("path");
  CREATE INDEX "folders_rels_admins_id_idx" ON "folders_rels" USING btree ("admins_id");
  CREATE INDEX "_folders_v_parent_idx" ON "_folders_v" USING btree ("parent_id");
  CREATE INDEX "_folders_v_version_version__h_folders_idx" ON "_folders_v" USING btree ("version__h_folders_id");
  CREATE INDEX "_folders_v_version_version_updated_at_idx" ON "_folders_v" USING btree ("version_updated_at");
  CREATE INDEX "_folders_v_version_version_created_at_idx" ON "_folders_v" USING btree ("version_created_at");
  CREATE INDEX "_folders_v_created_at_idx" ON "_folders_v" USING btree ("created_at");
  CREATE INDEX "_folders_v_updated_at_idx" ON "_folders_v" USING btree ("updated_at");
  CREATE INDEX "_folders_v_rels_order_idx" ON "_folders_v_rels" USING btree ("order");
  CREATE INDEX "_folders_v_rels_parent_idx" ON "_folders_v_rels" USING btree ("parent_id");
  CREATE INDEX "_folders_v_rels_path_idx" ON "_folders_v_rels" USING btree ("path");
  CREATE INDEX "_folders_v_rels_admins_id_idx" ON "_folders_v_rels" USING btree ("admins_id");
  CREATE INDEX "tags__h_tags_idx" ON "tags" USING btree ("_h_tags_id");
  CREATE INDEX "tags_updated_at_idx" ON "tags" USING btree ("updated_at");
  CREATE INDEX "tags_created_at_idx" ON "tags" USING btree ("created_at");
  CREATE INDEX "tags_rels_order_idx" ON "tags_rels" USING btree ("order");
  CREATE INDEX "tags_rels_parent_idx" ON "tags_rels" USING btree ("parent_id");
  CREATE INDEX "tags_rels_path_idx" ON "tags_rels" USING btree ("path");
  CREATE INDEX "tags_rels_admins_id_idx" ON "tags_rels" USING btree ("admins_id");
  CREATE INDEX "_tags_v_parent_idx" ON "_tags_v" USING btree ("parent_id");
  CREATE INDEX "_tags_v_version_version__h_tags_idx" ON "_tags_v" USING btree ("version__h_tags_id");
  CREATE INDEX "_tags_v_version_version_updated_at_idx" ON "_tags_v" USING btree ("version_updated_at");
  CREATE INDEX "_tags_v_version_version_created_at_idx" ON "_tags_v" USING btree ("version_created_at");
  CREATE INDEX "_tags_v_created_at_idx" ON "_tags_v" USING btree ("created_at");
  CREATE INDEX "_tags_v_updated_at_idx" ON "_tags_v" USING btree ("updated_at");
  CREATE INDEX "_tags_v_rels_order_idx" ON "_tags_v_rels" USING btree ("order");
  CREATE INDEX "_tags_v_rels_parent_idx" ON "_tags_v_rels" USING btree ("parent_id");
  CREATE INDEX "_tags_v_rels_path_idx" ON "_tags_v_rels" USING btree ("path");
  CREATE INDEX "_tags_v_rels_admins_id_idx" ON "_tags_v_rels" USING btree ("admins_id");
  CREATE INDEX "works_gallery_order_idx" ON "works_gallery" USING btree ("_order");
  CREATE INDEX "works_gallery_parent_id_idx" ON "works_gallery" USING btree ("_parent_id");
  CREATE INDEX "works_gallery_image_idx" ON "works_gallery" USING btree ("image_id");
  CREATE INDEX "works_awards_order_idx" ON "works_awards" USING btree ("_order");
  CREATE INDEX "works_awards_parent_id_idx" ON "works_awards" USING btree ("_parent_id");
  CREATE INDEX "works_credits_order_idx" ON "works_credits" USING btree ("_order");
  CREATE INDEX "works_credits_parent_id_idx" ON "works_credits" USING btree ("_parent_id");
  CREATE INDEX "works__order_idx" ON "works" USING btree ("_order");
  CREATE UNIQUE INDEX "works_slug_idx" ON "works" USING btree ("slug");
  CREATE INDEX "works_poster_idx" ON "works" USING btree ("poster_id");
  CREATE INDEX "works_trailer_file_idx" ON "works" USING btree ("trailer_file_id");
  CREATE INDEX "works_updated_at_idx" ON "works" USING btree ("updated_at");
  CREATE INDEX "works_created_at_idx" ON "works" USING btree ("created_at");
  CREATE INDEX "works__status_idx" ON "works" USING btree ("_status");
  CREATE INDEX "works_rels_order_idx" ON "works_rels" USING btree ("order");
  CREATE INDEX "works_rels_parent_idx" ON "works_rels" USING btree ("parent_id");
  CREATE INDEX "works_rels_path_idx" ON "works_rels" USING btree ("path");
  CREATE INDEX "works_rels_private_media_id_idx" ON "works_rels" USING btree ("private_media_id");
  CREATE INDEX "works_rels_admins_id_idx" ON "works_rels" USING btree ("admins_id");
  CREATE INDEX "_works_v_version_gallery_order_idx" ON "_works_v_version_gallery" USING btree ("_order");
  CREATE INDEX "_works_v_version_gallery_parent_id_idx" ON "_works_v_version_gallery" USING btree ("_parent_id");
  CREATE INDEX "_works_v_version_gallery_image_idx" ON "_works_v_version_gallery" USING btree ("image_id");
  CREATE INDEX "_works_v_version_awards_order_idx" ON "_works_v_version_awards" USING btree ("_order");
  CREATE INDEX "_works_v_version_awards_parent_id_idx" ON "_works_v_version_awards" USING btree ("_parent_id");
  CREATE INDEX "_works_v_version_credits_order_idx" ON "_works_v_version_credits" USING btree ("_order");
  CREATE INDEX "_works_v_version_credits_parent_id_idx" ON "_works_v_version_credits" USING btree ("_parent_id");
  CREATE INDEX "_works_v_parent_idx" ON "_works_v" USING btree ("parent_id");
  CREATE INDEX "_works_v_version_version__order_idx" ON "_works_v" USING btree ("version__order");
  CREATE INDEX "_works_v_version_version_slug_idx" ON "_works_v" USING btree ("version_slug");
  CREATE INDEX "_works_v_version_version_poster_idx" ON "_works_v" USING btree ("version_poster_id");
  CREATE INDEX "_works_v_version_version_trailer_file_idx" ON "_works_v" USING btree ("version_trailer_file_id");
  CREATE INDEX "_works_v_version_version_updated_at_idx" ON "_works_v" USING btree ("version_updated_at");
  CREATE INDEX "_works_v_version_version_created_at_idx" ON "_works_v" USING btree ("version_created_at");
  CREATE INDEX "_works_v_version_version__status_idx" ON "_works_v" USING btree ("version__status");
  CREATE INDEX "_works_v_created_at_idx" ON "_works_v" USING btree ("created_at");
  CREATE INDEX "_works_v_updated_at_idx" ON "_works_v" USING btree ("updated_at");
  CREATE INDEX "_works_v_published_locale_idx" ON "_works_v" USING btree ("published_locale");
  CREATE INDEX "_works_v_latest_idx" ON "_works_v" USING btree ("latest");
  CREATE INDEX "_works_v_autosave_idx" ON "_works_v" USING btree ("autosave");
  CREATE INDEX "_works_v_rels_order_idx" ON "_works_v_rels" USING btree ("order");
  CREATE INDEX "_works_v_rels_parent_idx" ON "_works_v_rels" USING btree ("parent_id");
  CREATE INDEX "_works_v_rels_path_idx" ON "_works_v_rels" USING btree ("path");
  CREATE INDEX "_works_v_rels_private_media_id_idx" ON "_works_v_rels" USING btree ("private_media_id");
  CREATE INDEX "_works_v_rels_admins_id_idx" ON "_works_v_rels" USING btree ("admins_id");
  CREATE INDEX "writings_featured_image_idx" ON "writings" USING btree ("featured_image_id");
  CREATE INDEX "writings_attachment_idx" ON "writings" USING btree ("attachment_id");
  CREATE UNIQUE INDEX "writings_slug_idx" ON "writings" USING btree ("slug");
  CREATE INDEX "writings_updated_at_idx" ON "writings" USING btree ("updated_at");
  CREATE INDEX "writings_created_at_idx" ON "writings" USING btree ("created_at");
  CREATE INDEX "writings__status_idx" ON "writings" USING btree ("_status");
  CREATE INDEX "writings_rels_order_idx" ON "writings_rels" USING btree ("order");
  CREATE INDEX "writings_rels_parent_idx" ON "writings_rels" USING btree ("parent_id");
  CREATE INDEX "writings_rels_path_idx" ON "writings_rels" USING btree ("path");
  CREATE INDEX "writings_rels_admins_id_idx" ON "writings_rels" USING btree ("admins_id");
  CREATE INDEX "_writings_v_parent_idx" ON "_writings_v" USING btree ("parent_id");
  CREATE INDEX "_writings_v_version_version_featured_image_idx" ON "_writings_v" USING btree ("version_featured_image_id");
  CREATE INDEX "_writings_v_version_version_attachment_idx" ON "_writings_v" USING btree ("version_attachment_id");
  CREATE INDEX "_writings_v_version_version_slug_idx" ON "_writings_v" USING btree ("version_slug");
  CREATE INDEX "_writings_v_version_version_updated_at_idx" ON "_writings_v" USING btree ("version_updated_at");
  CREATE INDEX "_writings_v_version_version_created_at_idx" ON "_writings_v" USING btree ("version_created_at");
  CREATE INDEX "_writings_v_version_version__status_idx" ON "_writings_v" USING btree ("version__status");
  CREATE INDEX "_writings_v_created_at_idx" ON "_writings_v" USING btree ("created_at");
  CREATE INDEX "_writings_v_updated_at_idx" ON "_writings_v" USING btree ("updated_at");
  CREATE INDEX "_writings_v_published_locale_idx" ON "_writings_v" USING btree ("published_locale");
  CREATE INDEX "_writings_v_latest_idx" ON "_writings_v" USING btree ("latest");
  CREATE INDEX "_writings_v_rels_order_idx" ON "_writings_v_rels" USING btree ("order");
  CREATE INDEX "_writings_v_rels_parent_idx" ON "_writings_v_rels" USING btree ("parent_id");
  CREATE INDEX "_writings_v_rels_path_idx" ON "_writings_v_rels" USING btree ("path");
  CREATE INDEX "_writings_v_rels_admins_id_idx" ON "_writings_v_rels" USING btree ("admins_id");
  CREATE INDEX "writing_files_updated_at_idx" ON "writing_files" USING btree ("updated_at");
  CREATE INDEX "writing_files_created_at_idx" ON "writing_files" USING btree ("created_at");
  CREATE UNIQUE INDEX "writing_files_filename_idx" ON "writing_files" USING btree ("filename");
  CREATE INDEX "writing_files_original_original_filename_idx" ON "writing_files" USING btree ("original_filename");
  CREATE INDEX "writing_files_rels_order_idx" ON "writing_files_rels" USING btree ("order");
  CREATE INDEX "writing_files_rels_parent_idx" ON "writing_files_rels" USING btree ("parent_id");
  CREATE INDEX "writing_files_rels_path_idx" ON "writing_files_rels" USING btree ("path");
  CREATE INDEX "writing_files_rels_admins_id_idx" ON "writing_files_rels" USING btree ("admins_id");
  CREATE INDEX "awards__order_idx" ON "awards" USING btree ("_order");
  CREATE INDEX "awards_laurel_idx" ON "awards" USING btree ("laurel_id");
  CREATE INDEX "awards_image_idx" ON "awards" USING btree ("image_id");
  CREATE INDEX "awards_film_idx" ON "awards" USING btree ("film_id");
  CREATE INDEX "awards_updated_at_idx" ON "awards" USING btree ("updated_at");
  CREATE INDEX "awards_created_at_idx" ON "awards" USING btree ("created_at");
  CREATE INDEX "awards__status_idx" ON "awards" USING btree ("_status");
  CREATE INDEX "awards_rels_order_idx" ON "awards_rels" USING btree ("order");
  CREATE INDEX "awards_rels_parent_idx" ON "awards_rels" USING btree ("parent_id");
  CREATE INDEX "awards_rels_path_idx" ON "awards_rels" USING btree ("path");
  CREATE INDEX "awards_rels_admins_id_idx" ON "awards_rels" USING btree ("admins_id");
  CREATE INDEX "_awards_v_parent_idx" ON "_awards_v" USING btree ("parent_id");
  CREATE INDEX "_awards_v_version_version__order_idx" ON "_awards_v" USING btree ("version__order");
  CREATE INDEX "_awards_v_version_version_laurel_idx" ON "_awards_v" USING btree ("version_laurel_id");
  CREATE INDEX "_awards_v_version_version_image_idx" ON "_awards_v" USING btree ("version_image_id");
  CREATE INDEX "_awards_v_version_version_film_idx" ON "_awards_v" USING btree ("version_film_id");
  CREATE INDEX "_awards_v_version_version_updated_at_idx" ON "_awards_v" USING btree ("version_updated_at");
  CREATE INDEX "_awards_v_version_version_created_at_idx" ON "_awards_v" USING btree ("version_created_at");
  CREATE INDEX "_awards_v_version_version__status_idx" ON "_awards_v" USING btree ("version__status");
  CREATE INDEX "_awards_v_created_at_idx" ON "_awards_v" USING btree ("created_at");
  CREATE INDEX "_awards_v_updated_at_idx" ON "_awards_v" USING btree ("updated_at");
  CREATE INDEX "_awards_v_published_locale_idx" ON "_awards_v" USING btree ("published_locale");
  CREATE INDEX "_awards_v_latest_idx" ON "_awards_v" USING btree ("latest");
  CREATE INDEX "_awards_v_autosave_idx" ON "_awards_v" USING btree ("autosave");
  CREATE INDEX "_awards_v_rels_order_idx" ON "_awards_v_rels" USING btree ("order");
  CREATE INDEX "_awards_v_rels_parent_idx" ON "_awards_v_rels" USING btree ("parent_id");
  CREATE INDEX "_awards_v_rels_path_idx" ON "_awards_v_rels" USING btree ("path");
  CREATE INDEX "_awards_v_rels_admins_id_idx" ON "_awards_v_rels" USING btree ("admins_id");
  CREATE INDEX "news__order_idx" ON "news" USING btree ("_order");
  CREATE UNIQUE INDEX "news_slug_idx" ON "news" USING btree ("slug");
  CREATE INDEX "news_main_image_idx" ON "news" USING btree ("main_image_id");
  CREATE INDEX "news_related_film_idx" ON "news" USING btree ("related_film_id");
  CREATE INDEX "news_updated_at_idx" ON "news" USING btree ("updated_at");
  CREATE INDEX "news_created_at_idx" ON "news" USING btree ("created_at");
  CREATE INDEX "news__status_idx" ON "news" USING btree ("_status");
  CREATE INDEX "news_rels_order_idx" ON "news_rels" USING btree ("order");
  CREATE INDEX "news_rels_parent_idx" ON "news_rels" USING btree ("parent_id");
  CREATE INDEX "news_rels_path_idx" ON "news_rels" USING btree ("path");
  CREATE INDEX "news_rels_admins_id_idx" ON "news_rels" USING btree ("admins_id");
  CREATE INDEX "_news_v_parent_idx" ON "_news_v" USING btree ("parent_id");
  CREATE INDEX "_news_v_version_version__order_idx" ON "_news_v" USING btree ("version__order");
  CREATE INDEX "_news_v_version_version_slug_idx" ON "_news_v" USING btree ("version_slug");
  CREATE INDEX "_news_v_version_version_main_image_idx" ON "_news_v" USING btree ("version_main_image_id");
  CREATE INDEX "_news_v_version_version_related_film_idx" ON "_news_v" USING btree ("version_related_film_id");
  CREATE INDEX "_news_v_version_version_updated_at_idx" ON "_news_v" USING btree ("version_updated_at");
  CREATE INDEX "_news_v_version_version_created_at_idx" ON "_news_v" USING btree ("version_created_at");
  CREATE INDEX "_news_v_version_version__status_idx" ON "_news_v" USING btree ("version__status");
  CREATE INDEX "_news_v_created_at_idx" ON "_news_v" USING btree ("created_at");
  CREATE INDEX "_news_v_updated_at_idx" ON "_news_v" USING btree ("updated_at");
  CREATE INDEX "_news_v_published_locale_idx" ON "_news_v" USING btree ("published_locale");
  CREATE INDEX "_news_v_latest_idx" ON "_news_v" USING btree ("latest");
  CREATE INDEX "_news_v_autosave_idx" ON "_news_v" USING btree ("autosave");
  CREATE INDEX "_news_v_rels_order_idx" ON "_news_v_rels" USING btree ("order");
  CREATE INDEX "_news_v_rels_parent_idx" ON "_news_v_rels" USING btree ("parent_id");
  CREATE INDEX "_news_v_rels_path_idx" ON "_news_v_rels" USING btree ("path");
  CREATE INDEX "_news_v_rels_admins_id_idx" ON "_news_v_rels" USING btree ("admins_id");
  CREATE INDEX "legal_pages_sections_order_idx" ON "legal_pages_sections" USING btree ("_order");
  CREATE INDEX "legal_pages_sections_parent_id_idx" ON "legal_pages_sections" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "legal_pages_page_type_idx" ON "legal_pages" USING btree ("page_type");
  CREATE INDEX "legal_pages_updated_at_idx" ON "legal_pages" USING btree ("updated_at");
  CREATE INDEX "legal_pages_created_at_idx" ON "legal_pages" USING btree ("created_at");
  CREATE INDEX "legal_pages__status_idx" ON "legal_pages" USING btree ("_status");
  CREATE INDEX "legal_pages_rels_order_idx" ON "legal_pages_rels" USING btree ("order");
  CREATE INDEX "legal_pages_rels_parent_idx" ON "legal_pages_rels" USING btree ("parent_id");
  CREATE INDEX "legal_pages_rels_path_idx" ON "legal_pages_rels" USING btree ("path");
  CREATE INDEX "legal_pages_rels_admins_id_idx" ON "legal_pages_rels" USING btree ("admins_id");
  CREATE INDEX "_legal_pages_v_version_sections_order_idx" ON "_legal_pages_v_version_sections" USING btree ("_order");
  CREATE INDEX "_legal_pages_v_version_sections_parent_id_idx" ON "_legal_pages_v_version_sections" USING btree ("_parent_id");
  CREATE INDEX "_legal_pages_v_parent_idx" ON "_legal_pages_v" USING btree ("parent_id");
  CREATE INDEX "_legal_pages_v_version_version_page_type_idx" ON "_legal_pages_v" USING btree ("version_page_type");
  CREATE INDEX "_legal_pages_v_version_version_updated_at_idx" ON "_legal_pages_v" USING btree ("version_updated_at");
  CREATE INDEX "_legal_pages_v_version_version_created_at_idx" ON "_legal_pages_v" USING btree ("version_created_at");
  CREATE INDEX "_legal_pages_v_version_version__status_idx" ON "_legal_pages_v" USING btree ("version__status");
  CREATE INDEX "_legal_pages_v_created_at_idx" ON "_legal_pages_v" USING btree ("created_at");
  CREATE INDEX "_legal_pages_v_updated_at_idx" ON "_legal_pages_v" USING btree ("updated_at");
  CREATE INDEX "_legal_pages_v_published_locale_idx" ON "_legal_pages_v" USING btree ("published_locale");
  CREATE INDEX "_legal_pages_v_latest_idx" ON "_legal_pages_v" USING btree ("latest");
  CREATE INDEX "_legal_pages_v_autosave_idx" ON "_legal_pages_v" USING btree ("autosave");
  CREATE INDEX "_legal_pages_v_rels_order_idx" ON "_legal_pages_v_rels" USING btree ("order");
  CREATE INDEX "_legal_pages_v_rels_parent_idx" ON "_legal_pages_v_rels" USING btree ("parent_id");
  CREATE INDEX "_legal_pages_v_rels_path_idx" ON "_legal_pages_v_rels" USING btree ("path");
  CREATE INDEX "_legal_pages_v_rels_admins_id_idx" ON "_legal_pages_v_rels" USING btree ("admins_id");
  CREATE INDEX "contact_messages_updated_at_idx" ON "contact_messages" USING btree ("updated_at");
  CREATE INDEX "contact_messages_created_at_idx" ON "contact_messages" USING btree ("created_at");
  CREATE INDEX "contact_messages_rels_order_idx" ON "contact_messages_rels" USING btree ("order");
  CREATE INDEX "contact_messages_rels_parent_idx" ON "contact_messages_rels" USING btree ("parent_id");
  CREATE INDEX "contact_messages_rels_path_idx" ON "contact_messages_rels" USING btree ("path");
  CREATE INDEX "contact_messages_rels_admins_id_idx" ON "contact_messages_rels" USING btree ("admins_id");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_admins_id_idx" ON "payload_locked_documents_rels" USING btree ("admins_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_private_media_id_idx" ON "payload_locked_documents_rels" USING btree ("private_media_id");
  CREATE INDEX "payload_locked_documents_rels_folders_id_idx" ON "payload_locked_documents_rels" USING btree ("folders_id");
  CREATE INDEX "payload_locked_documents_rels_tags_id_idx" ON "payload_locked_documents_rels" USING btree ("tags_id");
  CREATE INDEX "payload_locked_documents_rels_works_id_idx" ON "payload_locked_documents_rels" USING btree ("works_id");
  CREATE INDEX "payload_locked_documents_rels_writings_id_idx" ON "payload_locked_documents_rels" USING btree ("writings_id");
  CREATE INDEX "payload_locked_documents_rels_writing_files_id_idx" ON "payload_locked_documents_rels" USING btree ("writing_files_id");
  CREATE INDEX "payload_locked_documents_rels_awards_id_idx" ON "payload_locked_documents_rels" USING btree ("awards_id");
  CREATE INDEX "payload_locked_documents_rels_news_id_idx" ON "payload_locked_documents_rels" USING btree ("news_id");
  CREATE INDEX "payload_locked_documents_rels_legal_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("legal_pages_id");
  CREATE INDEX "payload_locked_documents_rels_contact_messages_id_idx" ON "payload_locked_documents_rels" USING btree ("contact_messages_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_admins_id_idx" ON "payload_preferences_rels" USING btree ("admins_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "payload_llm_instructions_entity_slug_idx" ON "payload_llm_instructions" USING btree ("entity_slug");
  CREATE INDEX "payload_llm_instructions_updated_at_idx" ON "payload_llm_instructions" USING btree ("updated_at");
  CREATE INDEX "payload_llm_instructions_created_at_idx" ON "payload_llm_instructions" USING btree ("created_at");
  CREATE INDEX "payload_llm_instructions_rels_order_idx" ON "payload_llm_instructions_rels" USING btree ("order");
  CREATE INDEX "payload_llm_instructions_rels_parent_idx" ON "payload_llm_instructions_rels" USING btree ("parent_id");
  CREATE INDEX "payload_llm_instructions_rels_path_idx" ON "payload_llm_instructions_rels" USING btree ("path");
  CREATE INDEX "payload_llm_instructions_rels_admins_id_idx" ON "payload_llm_instructions_rels" USING btree ("admins_id");
  CREATE INDEX "homepage_hero_images_order_idx" ON "homepage_hero_images" USING btree ("_order");
  CREATE INDEX "homepage_hero_images_parent_id_idx" ON "homepage_hero_images" USING btree ("_parent_id");
  CREATE INDEX "homepage_hero_images_image_idx" ON "homepage_hero_images" USING btree ("image_id");
  CREATE INDEX "homepage_featured_film_idx" ON "homepage" USING btree ("featured_film_id");
  CREATE INDEX "homepage_featured_video_idx" ON "homepage" USING btree ("featured_video_id");
  CREATE INDEX "homepage__status_idx" ON "homepage" USING btree ("_status");
  CREATE INDEX "homepage_rels_order_idx" ON "homepage_rels" USING btree ("order");
  CREATE INDEX "homepage_rels_parent_idx" ON "homepage_rels" USING btree ("parent_id");
  CREATE INDEX "homepage_rels_path_idx" ON "homepage_rels" USING btree ("path");
  CREATE INDEX "homepage_rels_admins_id_idx" ON "homepage_rels" USING btree ("admins_id");
  CREATE INDEX "_homepage_v_version_hero_images_order_idx" ON "_homepage_v_version_hero_images" USING btree ("_order");
  CREATE INDEX "_homepage_v_version_hero_images_parent_id_idx" ON "_homepage_v_version_hero_images" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_version_hero_images_image_idx" ON "_homepage_v_version_hero_images" USING btree ("image_id");
  CREATE INDEX "_homepage_v_version_version_featured_film_idx" ON "_homepage_v" USING btree ("version_featured_film_id");
  CREATE INDEX "_homepage_v_version_version_featured_video_idx" ON "_homepage_v" USING btree ("version_featured_video_id");
  CREATE INDEX "_homepage_v_version_version__status_idx" ON "_homepage_v" USING btree ("version__status");
  CREATE INDEX "_homepage_v_created_at_idx" ON "_homepage_v" USING btree ("created_at");
  CREATE INDEX "_homepage_v_updated_at_idx" ON "_homepage_v" USING btree ("updated_at");
  CREATE INDEX "_homepage_v_published_locale_idx" ON "_homepage_v" USING btree ("published_locale");
  CREATE INDEX "_homepage_v_latest_idx" ON "_homepage_v" USING btree ("latest");
  CREATE INDEX "_homepage_v_autosave_idx" ON "_homepage_v" USING btree ("autosave");
  CREATE INDEX "_homepage_v_rels_order_idx" ON "_homepage_v_rels" USING btree ("order");
  CREATE INDEX "_homepage_v_rels_parent_idx" ON "_homepage_v_rels" USING btree ("parent_id");
  CREATE INDEX "_homepage_v_rels_path_idx" ON "_homepage_v_rels" USING btree ("path");
  CREATE INDEX "_homepage_v_rels_admins_id_idx" ON "_homepage_v_rels" USING btree ("admins_id");
  CREATE INDEX "biography_about_chapters_order_idx" ON "biography_about_chapters" USING btree ("_order");
  CREATE INDEX "biography_about_chapters_parent_id_idx" ON "biography_about_chapters" USING btree ("_parent_id");
  CREATE INDEX "biography_portrait_idx" ON "biography" USING btree ("portrait_id");
  CREATE INDEX "biography__status_idx" ON "biography" USING btree ("_status");
  CREATE INDEX "biography_rels_order_idx" ON "biography_rels" USING btree ("order");
  CREATE INDEX "biography_rels_parent_idx" ON "biography_rels" USING btree ("parent_id");
  CREATE INDEX "biography_rels_path_idx" ON "biography_rels" USING btree ("path");
  CREATE INDEX "biography_rels_admins_id_idx" ON "biography_rels" USING btree ("admins_id");
  CREATE INDEX "_biography_v_version_about_chapters_order_idx" ON "_biography_v_version_about_chapters" USING btree ("_order");
  CREATE INDEX "_biography_v_version_about_chapters_parent_id_idx" ON "_biography_v_version_about_chapters" USING btree ("_parent_id");
  CREATE INDEX "_biography_v_version_version_portrait_idx" ON "_biography_v" USING btree ("version_portrait_id");
  CREATE INDEX "_biography_v_version_version__status_idx" ON "_biography_v" USING btree ("version__status");
  CREATE INDEX "_biography_v_created_at_idx" ON "_biography_v" USING btree ("created_at");
  CREATE INDEX "_biography_v_updated_at_idx" ON "_biography_v" USING btree ("updated_at");
  CREATE INDEX "_biography_v_published_locale_idx" ON "_biography_v" USING btree ("published_locale");
  CREATE INDEX "_biography_v_latest_idx" ON "_biography_v" USING btree ("latest");
  CREATE INDEX "_biography_v_autosave_idx" ON "_biography_v" USING btree ("autosave");
  CREATE INDEX "_biography_v_rels_order_idx" ON "_biography_v_rels" USING btree ("order");
  CREATE INDEX "_biography_v_rels_parent_idx" ON "_biography_v_rels" USING btree ("parent_id");
  CREATE INDEX "_biography_v_rels_path_idx" ON "_biography_v_rels" USING btree ("path");
  CREATE INDEX "_biography_v_rels_admins_id_idx" ON "_biography_v_rels" USING btree ("admins_id");
  CREATE INDEX "contact_settings__status_idx" ON "contact_settings" USING btree ("_status");
  CREATE INDEX "contact_settings_rels_order_idx" ON "contact_settings_rels" USING btree ("order");
  CREATE INDEX "contact_settings_rels_parent_idx" ON "contact_settings_rels" USING btree ("parent_id");
  CREATE INDEX "contact_settings_rels_path_idx" ON "contact_settings_rels" USING btree ("path");
  CREATE INDEX "contact_settings_rels_admins_id_idx" ON "contact_settings_rels" USING btree ("admins_id");
  CREATE INDEX "_contact_settings_v_version_version__status_idx" ON "_contact_settings_v" USING btree ("version__status");
  CREATE INDEX "_contact_settings_v_created_at_idx" ON "_contact_settings_v" USING btree ("created_at");
  CREATE INDEX "_contact_settings_v_updated_at_idx" ON "_contact_settings_v" USING btree ("updated_at");
  CREATE INDEX "_contact_settings_v_published_locale_idx" ON "_contact_settings_v" USING btree ("published_locale");
  CREATE INDEX "_contact_settings_v_latest_idx" ON "_contact_settings_v" USING btree ("latest");
  CREATE INDEX "_contact_settings_v_autosave_idx" ON "_contact_settings_v" USING btree ("autosave");
  CREATE INDEX "_contact_settings_v_rels_order_idx" ON "_contact_settings_v_rels" USING btree ("order");
  CREATE INDEX "_contact_settings_v_rels_parent_idx" ON "_contact_settings_v_rels" USING btree ("parent_id");
  CREATE INDEX "_contact_settings_v_rels_path_idx" ON "_contact_settings_v_rels" USING btree ("path");
  CREATE INDEX "_contact_settings_v_rels_admins_id_idx" ON "_contact_settings_v_rels" USING btree ("admins_id");
  CREATE INDEX "website_settings__status_idx" ON "website_settings" USING btree ("_status");
  CREATE INDEX "website_settings_rels_order_idx" ON "website_settings_rels" USING btree ("order");
  CREATE INDEX "website_settings_rels_parent_idx" ON "website_settings_rels" USING btree ("parent_id");
  CREATE INDEX "website_settings_rels_path_idx" ON "website_settings_rels" USING btree ("path");
  CREATE INDEX "website_settings_rels_admins_id_idx" ON "website_settings_rels" USING btree ("admins_id");
  CREATE INDEX "_website_settings_v_version_version__status_idx" ON "_website_settings_v" USING btree ("version__status");
  CREATE INDEX "_website_settings_v_created_at_idx" ON "_website_settings_v" USING btree ("created_at");
  CREATE INDEX "_website_settings_v_updated_at_idx" ON "_website_settings_v" USING btree ("updated_at");
  CREATE INDEX "_website_settings_v_published_locale_idx" ON "_website_settings_v" USING btree ("published_locale");
  CREATE INDEX "_website_settings_v_latest_idx" ON "_website_settings_v" USING btree ("latest");
  CREATE INDEX "_website_settings_v_autosave_idx" ON "_website_settings_v" USING btree ("autosave");
  CREATE INDEX "_website_settings_v_rels_order_idx" ON "_website_settings_v_rels" USING btree ("order");
  CREATE INDEX "_website_settings_v_rels_parent_idx" ON "_website_settings_v_rels" USING btree ("parent_id");
  CREATE INDEX "_website_settings_v_rels_path_idx" ON "_website_settings_v_rels" USING btree ("path");
  CREATE INDEX "_website_settings_v_rels_admins_id_idx" ON "_website_settings_v_rels" USING btree ("admins_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "admins_sessions" CASCADE;
  DROP TABLE "admins" CASCADE;
  DROP TABLE "admins_rels" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "media_rels" CASCADE;
  DROP TABLE "_media_v" CASCADE;
  DROP TABLE "_media_v_rels" CASCADE;
  DROP TABLE "private_media" CASCADE;
  DROP TABLE "private_media_rels" CASCADE;
  DROP TABLE "folders" CASCADE;
  DROP TABLE "folders_rels" CASCADE;
  DROP TABLE "_folders_v" CASCADE;
  DROP TABLE "_folders_v_rels" CASCADE;
  DROP TABLE "tags" CASCADE;
  DROP TABLE "tags_rels" CASCADE;
  DROP TABLE "_tags_v" CASCADE;
  DROP TABLE "_tags_v_rels" CASCADE;
  DROP TABLE "works_gallery" CASCADE;
  DROP TABLE "works_awards" CASCADE;
  DROP TABLE "works_credits" CASCADE;
  DROP TABLE "works" CASCADE;
  DROP TABLE "works_rels" CASCADE;
  DROP TABLE "_works_v_version_gallery" CASCADE;
  DROP TABLE "_works_v_version_awards" CASCADE;
  DROP TABLE "_works_v_version_credits" CASCADE;
  DROP TABLE "_works_v" CASCADE;
  DROP TABLE "_works_v_rels" CASCADE;
  DROP TABLE "writings" CASCADE;
  DROP TABLE "writings_rels" CASCADE;
  DROP TABLE "_writings_v" CASCADE;
  DROP TABLE "_writings_v_rels" CASCADE;
  DROP TABLE "writing_files" CASCADE;
  DROP TABLE "writing_files_rels" CASCADE;
  DROP TABLE "awards" CASCADE;
  DROP TABLE "awards_rels" CASCADE;
  DROP TABLE "_awards_v" CASCADE;
  DROP TABLE "_awards_v_rels" CASCADE;
  DROP TABLE "news" CASCADE;
  DROP TABLE "news_rels" CASCADE;
  DROP TABLE "_news_v" CASCADE;
  DROP TABLE "_news_v_rels" CASCADE;
  DROP TABLE "legal_pages_sections" CASCADE;
  DROP TABLE "legal_pages" CASCADE;
  DROP TABLE "legal_pages_rels" CASCADE;
  DROP TABLE "_legal_pages_v_version_sections" CASCADE;
  DROP TABLE "_legal_pages_v" CASCADE;
  DROP TABLE "_legal_pages_v_rels" CASCADE;
  DROP TABLE "contact_messages" CASCADE;
  DROP TABLE "contact_messages_rels" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "payload_llm_instructions" CASCADE;
  DROP TABLE "payload_llm_instructions_rels" CASCADE;
  DROP TABLE "homepage_hero_images" CASCADE;
  DROP TABLE "homepage" CASCADE;
  DROP TABLE "homepage_rels" CASCADE;
  DROP TABLE "_homepage_v_version_hero_images" CASCADE;
  DROP TABLE "_homepage_v" CASCADE;
  DROP TABLE "_homepage_v_rels" CASCADE;
  DROP TABLE "biography_about_chapters" CASCADE;
  DROP TABLE "biography" CASCADE;
  DROP TABLE "biography_rels" CASCADE;
  DROP TABLE "_biography_v_version_about_chapters" CASCADE;
  DROP TABLE "_biography_v" CASCADE;
  DROP TABLE "_biography_v_rels" CASCADE;
  DROP TABLE "contact_settings" CASCADE;
  DROP TABLE "contact_settings_rels" CASCADE;
  DROP TABLE "_contact_settings_v" CASCADE;
  DROP TABLE "_contact_settings_v_rels" CASCADE;
  DROP TABLE "website_settings" CASCADE;
  DROP TABLE "website_settings_rels" CASCADE;
  DROP TABLE "_website_settings_v" CASCADE;
  DROP TABLE "_website_settings_v_rels" CASCADE;
  DROP TYPE "public"."_locales";
  DROP TYPE "public"."enum_works_status";
  DROP TYPE "public"."enum__works_v_version_status";
  DROP TYPE "public"."enum__works_v_published_locale";
  DROP TYPE "public"."enum_writings_category";
  DROP TYPE "public"."enum_writings_attachment_visibility";
  DROP TYPE "public"."enum_writings_status";
  DROP TYPE "public"."enum__writings_v_version_category";
  DROP TYPE "public"."enum__writings_v_version_attachment_visibility";
  DROP TYPE "public"."enum__writings_v_version_status";
  DROP TYPE "public"."enum__writings_v_published_locale";
  DROP TYPE "public"."enum_awards_recognition";
  DROP TYPE "public"."enum_awards_status";
  DROP TYPE "public"."enum__awards_v_version_recognition";
  DROP TYPE "public"."enum__awards_v_version_status";
  DROP TYPE "public"."enum__awards_v_published_locale";
  DROP TYPE "public"."enum_news_status";
  DROP TYPE "public"."enum__news_v_version_status";
  DROP TYPE "public"."enum__news_v_published_locale";
  DROP TYPE "public"."enum_legal_pages_page_type";
  DROP TYPE "public"."enum_legal_pages_status";
  DROP TYPE "public"."enum__legal_pages_v_version_page_type";
  DROP TYPE "public"."enum__legal_pages_v_version_status";
  DROP TYPE "public"."enum__legal_pages_v_published_locale";
  DROP TYPE "public"."enum_contact_messages_status";
  DROP TYPE "public"."enum_payload_llm_instructions_entity_type";
  DROP TYPE "public"."enum_homepage_status";
  DROP TYPE "public"."enum__homepage_v_version_status";
  DROP TYPE "public"."enum__homepage_v_published_locale";
  DROP TYPE "public"."enum_biography_portrait_position";
  DROP TYPE "public"."enum_biography_status";
  DROP TYPE "public"."enum__biography_v_version_portrait_position";
  DROP TYPE "public"."enum__biography_v_version_status";
  DROP TYPE "public"."enum__biography_v_published_locale";
  DROP TYPE "public"."enum_contact_settings_status";
  DROP TYPE "public"."enum__contact_settings_v_version_status";
  DROP TYPE "public"."enum__contact_settings_v_published_locale";
  DROP TYPE "public"."enum_website_settings_status";
  DROP TYPE "public"."enum__website_settings_v_version_status";
  DROP TYPE "public"."enum__website_settings_v_published_locale";`)
}
