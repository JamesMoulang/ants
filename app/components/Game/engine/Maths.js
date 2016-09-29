class Maths {
	static clamp(value, min, max) {
		if (value < min) {
			return min;
		} else if (value > max) {
			return max;
		} else {
			return value;
		}
	}

	static towardsValue(value, amount, target) {
		if (value > target) {
			if (value - amount < target) {
				return target;
			} else {
				return value - amount;
			}
		} else if (value < target) {
			if (value + amount > target) {
				return target;
			} else {
				return value + amount;
			}
		} else {
			return value;
		}
	}

	static lerp(value, amount, target) {
		var total = target - value;
		return value + total * amount;
	}

	static parseCharacter(character) {
		var parsed = parseInt(character);
		if (isNaN(parsed)) {
			return 10 + character.charCodeAt(0) - 97;
		} else {
			return parsed;
		}
	}

	static parseHex(string) {
		var total = 0;
		total += this.parseCharacter(string[0]) * Math.pow(16, 1);
		total += this.parseCharacter(string[1]) * Math.pow(16, 0);
		return total;
	}

	static parseColour(string) {
		var str = string.toLowerCase();
		var r = this.parseHex('' + str[1] + str[2]);
		var g = this.parseHex('' + str[3] + str[4]);
		var b = this.parseHex('' + str[5] + str[6]);
		return {r, g, b};
	}

	static intToHex(int) {
		var string = '';
		var first = Math.floor(int / 16);
		if (first > 9) {
			string += String.fromCharCode(97+first-10);
		} else {
			string += first.toString();
		}

		var second = Math.floor(int-first*16);
		if (second > 9) {
			string += String.fromCharCode(97+second-10);
		} else {
			string += second.toString();
		}

		return string;
	}

	static parseRGB(rgb) {
		return '#' + this.intToHex(rgb.r) + this.intToHex(rgb.g) + this.intToHex(rgb.b);
	}
}

export default Maths;