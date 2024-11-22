console.log('hello, this is extendsForPixivBookmark');
window.addEventListener('load', () => {
	let tagList = document.getElementsByClassName('sc-1jxp5wn-1 hpRxDJ')[0];
	const interval = setInterval(() => {
		tagList = document.getElementsByClassName('sc-1jxp5wn-1 hpRxDJ')[0];
		if(tagList.tagName == "DIV") {
			console.log(tagList);
			main(tagList);
			clearInterval(interval);
		};
		console.log("interval continue");
	}, 1);

	function main(list) {
		const head = document.head;
		const tagList = list;
		const searchBox = document.createElement('div');
		searchBox.className = "searchBox";
		searchBox.innerHTML = '<svg id="searchTagIcon" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"/></svg><input id="searchTag" type="text" placeholder="search tags" autocomplete="off">';
		//searchBox.setAttribute('contenteditable', 'true');
		tagList.appendChild(searchBox);
	
		const newStyle = document.createElement('style');
		newStyle.innerHTML = ".searchBox {color: white;margin-right: 4px;margin-left: 4px;height: 40px;cursor: pointer;transition: width 0.5s ease; &:hover #searchTag, & #searchTag:focus {width: 200px; padding: 1px; &:focus{box-shadow: rgba(0, 150, 250, 0.32) 0px 0px 0px 4px; border: none;}} & svg {margin-top: 8px; margin-right: 0px; float: left;} & #searchTag {width:0px; height: 40px; padding: 0px; margin: 0px; float: left; border: none; border-radius: 4px; box-sizing: border-box; background-color: rgba(255, 255, 255, 0.227); transition: width 0.5s ease, border-width 0.5s ease;}}";
		head.appendChild(newStyle);
	
		function getUId(url) {
			const preStr = "https://www.pixiv.net/users/";
			const point = url.indexOf('/bookmarks');
			const uid = url.substring(preStr.length, point);
			return uid;
		}
		getUId(location.href);
	
		async function getData(url) {
			try {
				const response = await fetch(url);
				if (!response.ok) {
					console.error("応答が正常でありません: " + response.status);
					return false; // または、エラーメッセージを返す
				}
				const data = await response.json();
				//console.log(data);
				return data; // ここで取得したデータを返す
			} catch (error) {
				console.error("fetch error: " + error);
				return false; // エラー時にはnullを返すなど
			}
		}
	
		async function search(req) {
			if(req.trim() == "") return true;
			works.innerHTML = "";
			console.log(req);
			const searches = req.split(/[\s　]+/);
			console.log(searches);
			const illusts = [];
	
			const uid = getUId(location.href);
			const bookmarkURL = `https://www.pixiv.net/ajax/user/${uid}/illusts/bookmarks?tag=&offset=0&limit=1&rest=show&lang=ja&version=7dbc26ef9d3e46041edab6b22a8130108d5b344c`;
			const total = (await getData(bookmarkURL)).body.total;

			console.log(total);
			for(let i=0; i<=Math.floor(total/100); i++) {
				const limit = (() => {
					if(i == Math.floor(total/100)) return total%100;
					else return 100;
				})();
				console.log(limit);
				const data = (await getData(`https://www.pixiv.net/ajax/user/${uid}/illusts/bookmarks?tag=&offset=${i*100}&limit=${limit}&rest=show&lang=ja&version=7dbc26ef9d3e46041edab6b22a8130108d5b344c`)).body;

				for(let j=0;j<limit;j++) {
					const work = data.works[j]
					const tags = work.tags;
					const uTags = data.bookmarkTags[work.bookmarkData.id];
					if(uTags !== undefined) tags.push(...uTags);
					const str = JSON.stringify(tags);
					let term = 1;
					for(let k=0;k<searches.length;k++) {
						if(str.indexOf(searches[k]) == -1) term*=0;
						else term*=1;
					}
					if(term == 0) continue;
					//console.log(work);
					illusts.push(work);
					const image = document.createElement("a");
					image.style.cssText = `aspect-ratio: 1; background-image: url(${work.url}); background-size: 100%;`;
					image.href = `https://www.pixiv.net/artworks/${work.id}`
					works.appendChild(image);
				}
			}
			console.log(illusts);
			alert(`${illusts.length}件の作品が見つかりました。`);
		}

		const works = document.getElementsByClassName('sc-1rgyha8-0 leTtkh')[0]
		const defaultHTML = works.innerHTML;
		works.innerHTML = "";
		works.style.cssText = "display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px;";

	
		const searchTag = document.getElementById('searchTag');
		searchTag.addEventListener('keydown', (e) => {
			if(e.key != "Enter") return true;
			search(searchTag.value);
			searchTag.value = "";
		});
	
		const icon = document.getElementById('searchTagIcon');
		icon.addEventListener('click', () => {
			search(searchTag.value);
			searchTag.value = "";
		});
	
		searchTag.addEventListener('focus', () => {
			const url = location.href;
			const newURL = `https://www.pixiv.net/users/${getUId(url)}/bookmarks/artworks/customSearch`;
			if(url == newURL) return true;
			location.href = `https://www.pixiv.net/users/${getUId(url)}/bookmarks/artworks/customSearch`;
		})
	}
});

/*function main(list) {
	const head = document.head;
	const tagList = list;
	const searchBox = document.createElement('div');
	searchBox.className = "searchBox";
	searchBox.innerHTML = '<svg id="searchTagIcon" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"/></svg><input id="searchTag" type="text" placeholder="search tags" autocomplete="off">';
	//searchBox.setAttribute('contenteditable', 'true');
	tagList.appendChild(searchBox);

	const newStyle = document.createElement('style');
	newStyle.innerHTML = ".searchBox {color: white;margin-right: 4px;margin-left: 4px;height: 40px;cursor: pointer;transition: width 0.5s ease; &:hover #searchTag, & #searchTag:focus {width: 200px; padding: 1px; &:focus{box-shadow: rgba(0, 150, 250, 0.32) 0px 0px 0px 4px; border: none;}} & svg {margin-top: 8px; margin-right: 0px; float: left;} & #searchTag {width:0px; height: 40px; padding: 0px; margin: 0px; float: left; border: none; border-radius: 4px; box-sizing: border-box; background-color: rgba(255, 255, 255, 0.227); transition: width 0.5s ease, border-width 0.5s ease;}}";
	head.appendChild(newStyle);

	function getUId(url) {
		const preStr = "https://www.pixiv.net/users/";
		const point = url.indexOf('/bookmarks');
		const uid = url.substring(preStr.length, point);
		return uid;
	}
	getUId(location.href);

	async function getData(url) {
		try {
			const response = await fetch(url);
			if (!response.ok) {
				console.error("応答が正常でありません: " + response.status);
				return false; // または、エラーメッセージを返す
			}
			const data = await response.json();
			//console.log(data);
			return data; // ここで取得したデータを返す
		} catch (error) {
			console.error("fetch error: " + error);
			return false; // エラー時にはnullを返すなど
		}
	}

	async function search(req) {
		if(req.trim() == "") return true;
		console.log(req);
		const searches = req.split(/[\s　]+/);
		console.log(searches);
		const illusts = [];

		const uid = getUId(location.href);
		const bookmarkURL = `https://www.pixiv.net/ajax/user/${uid}/illusts/bookmarks?tag=&offset=0&limit=1&rest=show&lang=ja&version=7dbc26ef9d3e46041edab6b22a8130108d5b344c`;
		const total = (await getData(bookmarkURL)).body.total;
		console.log(total);
		for(let i=0; i<=Math.floor(total/100); i++) {
			const limit = (() => {
				if(i == Math.floor(total/100)) return total%100;
				else return 100;
			})();
			console.log(limit);
			const data = (await getData(`https://www.pixiv.net/ajax/user/${uid}/illusts/bookmarks?tag=&offset=${i*100}&limit=${limit}&rest=show&lang=ja&version=7dbc26ef9d3e46041edab6b22a8130108d5b344c`)).body;
			
			for(let j=0;j<limit;j++) {
				const work = data.works[j]
				const tags = work.tags;
				//console.log(tags);
				const uTags = data.bookmarkTags[work.bookmarkData.id];
				//console.log(uTags);
				if(uTags !== undefined) tags.push(...uTags);
				const str = JSON.stringify(tags);
				//console.log(str);
				//console.log(str);
				//console.log(searches.every(tag => tags.includes(tag)));
				//if(!searches.every(tag => tags.includes(tag))) continue;
				let term = 1;
				for(let k=0;k<searches.length;k++) {
					if(str.indexOf(searches[k]) == -1) term*=0;
					else term*=1;
				}
				if(term == 0) continue;
				//console.log(work);
				illusts.push(work);
			}
		}
		console.log(illusts);
	}

	const searchTag = document.getElementById('searchTag');
	searchTag.addEventListener('keydown', (e) => {
		if(e.key != "Enter") return true;
		search(searchTag.value);
		searchTag.value = "";
	});

	const icon = document.getElementById('searchTagIcon');
	icon.addEventListener('click', () => {
		search(searchTag.value);
		searchTag.value = "";
	});

	searchTag.addEventListener('focus', () => {
		const url = location.href;
		const newURL = `https://www.pixiv.net/users/${getUId(url)}/bookmarks/artworks/customSearch`;
		if(url == newURL) return true;
		location.href = `https://www.pixiv.net/users/${getUId(url)}/bookmarks/artworks/customSearch`;
	})
}*/