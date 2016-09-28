import _ from 'underscore';

var Images = {
	cache: {},
	loadedCount: 0,
	loading: false,
	onLoad: null,
	interval: null,

	load: function(key, url) {
		this.loadedCount++;

		var img = new Image();
		img.onload = function() {
			this.loadedCount--;
		}.bind(this);
		img.src = url;
		this.loading = true;

		if (this.cache[key] != null) {
			console.warn("Already cached a image with key " + key);
		} else {
			this.cache[key] = img;
		}

		this.interval = setInterval(function() {
			if (this.isLoaded()) {
				clearInterval(this.interval);
				if (this.onLoad != null) {
					this.onLoad()
				}
			}
		}.bind(this), 500);
	},

	isLoaded: function() {
		return this.loading && this.loadedCount == 0;
	}
}

export default Images;