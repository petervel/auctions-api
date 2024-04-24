import { ItemComment } from "./Comment";

export interface ListItem {
	id: number;

	object_type: string;
	object_subtype: string;
	object_id: number;
	object_name: string;

	username: string;
	post_date: string;
	edit_date: string;
	thumbs: number;
	image_id: number;

	body: string;

	deleted: boolean;
	comments: ItemComment[];

	// Derived data:
	_language?: string;
	_condition?: string;

	_starting_bid?: number;
	_soft_reserve?: number;
	_hard_reserve?: number;
	_bin_price?: number;

	_highest_bid?: number;

	_auction_end?: string;
	_auction_end_date?: string;

	_edit_timestamp?: number;

	_last_seen?: number;
}
