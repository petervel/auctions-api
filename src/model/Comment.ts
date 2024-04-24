export interface Comment {
	username: string;
	date: string;
	post_date: string;
	edit_date: string;
	edit_timestamp: number;
	thumbs: number;
	text: string;
}

export interface ItemComment extends Comment {
	is_bin: boolean;
	bid?: number;
}
