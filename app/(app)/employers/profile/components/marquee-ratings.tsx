import { cn } from "@/lib/utils";
import Image from "next/image";

const reviews = [
	{
		name: "Ally Rozu",
		username: "@allyrozu",
		body: "I've never seen anything like this before. It's amazing. I love it.",
		img: "https://avatar.vercel.sh/allyrozu",
		star: 5,
	},
	{
		name: "Ariza Kemly",
		username: "@arizakemly",
		body: "I don't know what to say. I'm speechless. This is amazing.",
		img: "https://avatar.vercel.sh/arizakemly",
		star: 4,
	},
	{
		name: "Zeyn Kemlerina",
		username: "@zeynkemlerina",
		body: "I'm at a loss for words. This is amazing. I love it.",
		img: "https://avatar.vercel.sh/zeynkemlerina",
		star: 5,
	},
	{
		name: "Suzeyn Adrian",
		username: "@suzeynadrian",
		body: "I'm at a loss for words. This is amazing. I love it.",
		img: "https://avatar.vercel.sh/suzeynadrian",
		star: 4,
	},
	{
		name: "Edrina Valentines",
		username: "@edrinavalentines",
		body: "I'm at a loss for words. This is amazing. I love it.",
		img: "https://avatar.vercel.sh/edrinavalentines",
		star: 5,
	},
	{
		name: "Vivi Reri",
		username: "@vivireri",
		body: "I'm at a loss for words. This is amazing. I love it.",
		img: "https://avatar.vercel.sh/vivireri",
		star: 4,
	},
	{
		name: "Wu Speki",
		username: "@wuspeki",
		body: "I'm at a loss for words. This is amazing. I love it.",
		img: "https://avatar.vercel.sh/wuspeki",
		star: 5,
	},
	{
		name: "Sif Alro",
		username: "@sifalro",
		body: "I'm at a loss for words. This is amazing. I love it.",
		img: "https://avatar.vercel.sh/sifalro",
		star: 4,
	},
	{
		name: "Rozu Ally",
		username: "@rozually",
		body: "I'm at a loss for words. This is amazing. I love it.",
		img: "https://avatar.vercel.sh/rozually",
		star: 5,
	},
	{
		name: "Kemlerina Zeyn",
		username: "@kemlerinazeyn",
		body: "I'm at a loss for words. This is amazing. I love it.",
		img: "https://avatar.vercel.sh/kemlerinazeyn",
		star: 4,
	},
	{
		name: "Adrian Ariza",
		username: "@adrianariza",
		body: "I'm at a loss for words. This is amazing. I love it.",
		img: "https://avatar.vercel.sh/adrianariza",
		star: 5,
	},
	{
		name: "Reri Suzeyn",
		username: "@rerisuzeyn",
		body: "I'm at a loss for words. This is amazing. I love it.",
		img: "https://avatar.vercel.sh/rerisuzeyn",
		star: 4,
	},
	{
		name: "Valentines Wu",
		username: "@valentineswu",
		body: "I'm at a loss for words. This is amazing. I love it.",
		img: "https://avatar.vercel.sh/valentineswu",
		star: 5,
	},
	{
		name: "Speki Edrina",
		username: "@speki edrina",
		body: "I'm at a loss for words. This is amazing. I love it.",
		img: "https://avatar.vercel.sh/spekiedrina",
		star: 4,
	},
	{
		name: "Kemly Sif",
		username: "@kemlysif",
		body: "I'm at a loss for words. This is amazing. I love it.",
		img: "https://avatar.vercel.sh/kemlysif",
		star: 5,
	},
	{
		name: "Alro Vivi",
		username: "@alrovivi",
		body: "I'm at a loss for words. This is amazing. I love it.",
		img: "https://avatar.vercel.sh/alrovivi",
		star: 4,
	},
];

// Only show 2 rows of 4 cards each
const firstRow = reviews.slice(0, 4);
const secondRow = reviews.slice(4, 8);

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
			{/* Star rating display */}
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

// Static cards, no marquee
export function RatingsCards() {
	return (
		<div className="space-y-4 w-full">
			<div className="flex flex-row flex-nowrap gap-4 justify-center overflow-x-auto">
				{firstRow.map((review) => (
					<ReviewCard key={review.username} {...review} />
				))}
			</div>
			<div className="flex flex-row flex-nowrap gap-4 justify-center overflow-x-auto">
				{secondRow.map((review) => (
					<ReviewCard key={review.username} {...review} />
				))}
			</div>
		</div>
	);
}
