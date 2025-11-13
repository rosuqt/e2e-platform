import {  useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const sections = [
	{
		title: "User Agreement",
		content: `Welcome to Seekr. By accessing or using our platform, you agree to comply with and be bound by these terms. You must use Seekr in accordance with all applicable laws and regulations. You agree not to misuse the platform, attempt unauthorized access, or engage in any activity that could harm Seekr or its users. Your account is personal and you are responsible for all activities under your credentials. Seekr reserves the right to suspend or terminate accounts that violate these terms or applicable laws. Continued use of Seekr constitutes acceptance of any changes to this agreement.`,
	},
	{
		title: "Privacy Policy",
		content: `Seekr values your privacy and is committed to protecting your personal information. We collect information you provide directly, such as when you create an account, as well as data collected automatically, like usage statistics and cookies. Your data is used to provide and improve our services, communicate with you, and comply with legal obligations. We do not sell your personal information to third parties. You have the right to access, correct, or delete your data, and to withdraw consent at any time. For more details, please review our full privacy practices on our website.`,
	},
	{
		title: "Cookie Policy",
		content: `Seekr uses cookies and similar technologies to enhance your experience, analyze site usage, and deliver personalized content. Cookies help us remember your preferences, keep you signed in, and understand how you interact with our platform. You can control cookie settings through your browser, but disabling cookies may affect your ability to use certain features. By continuing to use Seekr, you consent to our use of cookies as described in this policy. For more information on how we use cookies and your choices, please visit our Cookie Policy page.`,
	},
];

type LegalModalProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
};

export default function LegalModal({
	open,
	onOpenChange,
}: LegalModalProps) {
	const sectionRefs = [
		useRef<HTMLDivElement>(null),
		useRef<HTMLDivElement>(null),
		useRef<HTMLDivElement>(null),
	];

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-3xl max-h-[80vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle className="text-center text-2xl font-bold text-gray-800">
						Terms and Conditions
					</DialogTitle>
					<DialogDescription className="text-center text-gray-500">
						Please read our terms and conditions carefully
					</DialogDescription>
				</DialogHeader>
				<div className="text-sm text-gray-700 space-y-6 mt-4 px-2">
					{sections.map((section, index) => (
						<div key={index} ref={sectionRefs[index]}>
							<h3 className="font-semibold text-gray-800 text-xl">
								{section.title}
							</h3>
							<p className="leading-relaxed whitespace-pre-wrap">
								{section.content}
							</p>
						</div>
					))}
				</div>
				<div className="flex justify-end mt-6">
					<Button
						onClick={() => onOpenChange(false)}
						className="bg-blue-600 hover:bg-blue-700 text-white font-medium"
					>
						Close
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
