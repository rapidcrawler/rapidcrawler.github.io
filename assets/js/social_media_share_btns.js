/* Social Share Links
Whatsapp: https://api.whatsapp.com/send?text=[post-title] [post-url]
Facebook: https://www.facebook.com/sharer.php?u=[post-url]
LinkedIn: https://www.linkedin.com/shareArticle?url=[post-url]&title=[post-title]
Twitter: https://twitter.com/share?url=[post-url]&text=[post-title]
Reddit: https://reddit.com/submit?url=[post-url]&title=[post-title]
eMail: $email = 'mailto:?subject=' . $[post-title] . '&body=Check out this site: '. $[post-url] .'" title="Share by Email';
*/

const facebookBtn = document.querySelector(".facebook-btn")
const twitterBtn = document.querySelector(".twitter-btn")
const linkedInBtn = document.querySelector(".linkedin-btn")
const whatsappBtn = document.querySelector(".whatsapp-btn")

function init(){	
	const pinterestImg = document.querySelector(".pinterest-img");
	let postUrl = encodeURI(document.location.href);
	let postTitle = encodeURI("Check out this new article on Juspreet51.in");
	let postImg = encodeURI(pinterestImg.src);

	facebookBtn.setAttribute("href", `https://www.facebook.com/sharer.php?u=${postUrl}`);
	twitterBtn.setAttribute("href", `https://twitter.com/share?url=${postUrl}&text=${postTitle}`);
	linkedInBtn.setAttribute("href", `https://www.linkedin.com/shareArticle?url=${postUrl}&title=${postTitle}`);
	whatsappBtn.setAttribute("href", `https://api.whatsapp.com/send?text=${postTitle} ${postUrl}`);
}

init();