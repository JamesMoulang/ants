import _ from 'underscore';

var Images = {
	cache: {},
	loadedCount: 0,
	loading: false,
	onLoad: null,
	interval: null,
	keys: [],

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
			this.keys.push(key);
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
		var complete = true;
		_.each(this.keys, function(key) {
			if (!this.cache[key].complete) {
				complete = false;
			}
		}.bind(this));
		return complete;
	}
}

export default Images;