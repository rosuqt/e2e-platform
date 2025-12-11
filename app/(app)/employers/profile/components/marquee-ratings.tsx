/* eslint-disable @typescript-eslint/no-explicit-any */
import { cn } from "@/lib/utils";
import Image from "next/image";
import { FaRegSmileBeam } from "react-icons/fa";

const ReviewCard = ({
	img,
	name,
	username,
	body,
	star,
}: {
	img: string;
	name: string;
	username: string;
	body: string;
	star: number;
}) => {
	return (
		<figure
			className={cn(
				"relative h-full w-64 cursor-pointer overflow-hidden rounded-xl border p-4",
				"border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
				"dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
			)}
		>
			<div className="flex flex-row items-center gap-2">
				<Image className="rounded-full" width={32} height={32} alt="" src={img} />
				<div className="flex flex-col">
					<figcaption className="text-sm font-medium dark:text-white">
						{name}
					</figcaption>
					<p className="text-xs font-medium dark:text-white/40">{username}</p>
				</div>
			</div>
			<div className="mt-1 flex flex-row items-center gap-0.5">
				{Array.from({ length: 5 }).map((_, i) => (
					<span
						key={i}
						className={
							i < star
								? "text-yellow-400"
								: "text-gray-300 dark:text-gray-600"
						}
					>
						★
					</span>
				))}
			</div>
			<blockquote className="mt-2 text-sm">{body}</blockquote>
		</figure>
	);
};

// Accept ratings as prop
export function RatingsCards({ ratings }: { ratings?: any[] }) {
	const cards =
		Array.isArray(ratings) && ratings.length > 0
			? ratings.slice(0, 8).map((r) => {
				const student = r.registered_students || {};
				return {
					name:
						student.first_name && student.last_name
							? `${student.first_name} ${student.last_name}`
							: student.first_name || "Anonymous",
					username: student.email
						? `@${student.email.split("@")[0]}`
						: "",
					body: r.overall_comment && r.overall_comment.trim().length > 0
						? r.overall_comment
						: "No comment provided.",
					img:
						student.profile_img ||
						"https://dbuyxpovejdakzveiprx.supabase.co/storage/v1/object/public/app.images//default-pfp.jpg",
					star: typeof r.overall_rating === "number" ? r.overall_rating : 0,
				};
			})
			: [];

	const firstRow = cards.slice(0, 4);
	const secondRow = cards.slice(4, 8);

	return (
		<div className="space-y-4 w-full">
			<div className="flex flex-row flex-nowrap gap-4 justify-center overflow-x-auto">
				{firstRow.length > 0 ? (
					firstRow.map((review, i) => (
						<ReviewCard key={review.username + i} {...review} />
					))
				) : (
					<div className="flex flex-col items-center justify-center text-gray-500 text-center w-full py-8">
						<FaRegSmileBeam size={36} className="mb-2 text-blue-400" />
						<div>
							No ratings yet!<br />
							Be the first to leave a review and help others.
						</div>
					</div>
				)}
			</div>
			<div className="flex flex-row flex-nowrap gap-4 justify-center overflow-x-auto">
				{secondRow.length > 0
					? secondRow.map((review, i) => (
							<ReviewCard key={review.username + "2" + i} {...review} />
					  ))
					: null}
			</div>
		</div>
	);
}
