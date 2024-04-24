import { Comment } from "./Comment";

export interface GeekList {
	id: number;
	title: string;
	username: string;
	post_date: string;
	post_timestamp: number;
	edit_date: string;
	edit_timestamp: number;
	thumbs: number;
	item_count: number;
	description: string;
	tos_url: string;
	comments: Comment[];
}
