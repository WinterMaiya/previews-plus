const checkIfInList = (list, item) => {
	// This checks to see if a film is in a watchlist. Because the list is not organized we have to iterate through with O(n)
	if (list.length === 0) return false;
	for (let i of list) {
		// We are checking the TMDB ids as they have to match
		if (i.id === item.id) return true;
	}
	return false;
};

export default checkIfInList;
