import { createClient, SupabaseClient } from '@supabase/supabase-js';

export class SupabaseUtil {
	private readonly _supabase_client: SupabaseClient;
	private readonly _supabase_prof_img_bucket_name: string;
	private readonly _supabase_post_media_bucket_name: string;

	constructor() {
		this._supabase_client = createClient(
			process.env.SUPABASE_PROJECT_URL!,
			process.env.SUPABASE_ACCESS_KEY!,
		);
		this._supabase_prof_img_bucket_name =
			process.env.SUPABASE_PROFILE_IMG_BUCKET_NAME!;
		this._supabase_post_media_bucket_name =
			process.env.SUPABASE_POST_MEDIA_BUCKET_NAME!;
	}

	uploadNewMedia = async (
		mediaType: 'post' | 'profileImage',
		mediaName: string,
		mediaBuffer: Buffer,
		mediaMimeType: string,
	): Promise<
		{ data: { path: string }; error: null } | { data: null; error: any }
	> => {
		switch (mediaType) {
			case 'post':
				return await this._supabase_client.storage
					.from(this._supabase_post_media_bucket_name)
					.upload(mediaName, mediaBuffer, { contentType: mediaMimeType });
			case 'profileImage':
				return await this._supabase_client.storage
					.from(this._supabase_prof_img_bucket_name)
					.upload(mediaName, mediaBuffer, { contentType: mediaMimeType });
		}
	};

	updateMedia = async (
		mediaType: 'post' | 'profileImage',
		newMediaName: string,
		newMediaBuffer: Buffer,
		newMediaMimeType: string,
	): Promise<
		{ data: { path: string }; error: null } | { data: null; error: any }
	> => {
		switch (mediaType) {
			case 'post':
				return await this._supabase_client.storage
					.from(this._supabase_post_media_bucket_name)
					.update(newMediaName, newMediaBuffer, {
						contentType: newMediaMimeType,
					});
			case 'profileImage':
				return await this._supabase_client.storage
					.from(this._supabase_prof_img_bucket_name)
					.update(newMediaName, newMediaBuffer, {
						contentType: newMediaMimeType,
					});
		}
	};

	deleteMedia = async (
		mediaType: 'post' | 'profileImage',
		mediaName: string,
	): Promise<{ data: any; error: null } | { data: null; error: any }> => {
		switch (mediaType) {
			case 'post':
				return await this._supabase_client.storage
					.from(this._supabase_post_media_bucket_name)
					.remove([mediaName]);
			case 'profileImage':
				return await this._supabase_client.storage
					.from(this._supabase_prof_img_bucket_name)
					.remove([mediaName]);
		}
	};

	fetchMediaUrl = (
		mediaType: 'post' | 'profileImage',
		mediaName: string,
	): string => {
		switch (mediaType) {
			case 'post':
				return this._supabase_client.storage
					.from(this._supabase_post_media_bucket_name)
					.getPublicUrl(mediaName).data.publicUrl;
			case 'profileImage':
				return this._supabase_client.storage
					.from(this._supabase_prof_img_bucket_name)
					.getPublicUrl(mediaName).data.publicUrl;
		}
	};
}
