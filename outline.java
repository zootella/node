

























// Parse from text

/**
 * Parse the data of a text outline at the start of c into a new Outline object.
 * There must be a blank line marking the end of the text outline, throws a ChopException if it hasn't arrived yet.
 * Returns a new Outline object, and removes the data it parsed from d.
 * If the text outline is invalid, removes it from d and throws a DataException.
 */
public static Outline fromText(Clip c) {
	List<String> lines = Text.group(c); // Remove a group of lines that end with a blank line from the start of c
	List<Outline> list = new ArrayList<Outline>();
	for (String line : lines) list.add(parse(line)); // Parse each text line into an Outline object
	if (list.isEmpty()) throw new DataException(); // Make sure we got at least one line
	Outline o = group(list); // Look at indent to group the list into a hierarchy
	if (!list.isEmpty()) throw new DataException(); // Make sure there was just one outline
	return o;
}

/** Given a List of Outline objects made from lines of text, look at indent to group them into a hierarchy. */
private static Outline group(List<Outline> list) {
	Outline o = list.remove(0); // Pull the first one in the list, this is us
	while (!list.isEmpty() && o.indent < list.get(0).indent) // Loop while list starts with a line indented more than we are
		o.add(group(list)); // Have it grab its sub-lines from list, and then add it to our contents
	return o;
}

/** Parse a line of text from a text outline like "  name:value" into a new Outline object. */
private static Outline parse(String s) {
	try {
		
		// Count how many indent spaces s has
		int indent = 0;
		while (s.charAt(indent) == ' ') indent++; // Works with spaces only, not tabs
		s = Text.after(s, indent); // Move beyond them, making s like "name:value"
		
		// Split s around ":" to get the name and value
		Split<String> text = Text.split(s, ":");
		if (!text.found) throw new DataException(); // Make sure there is a ":"
		String name = text.before;
		Data value = Encode.unquote(text.after); // Turn the quoted text back into the data it was made from

		// Make an Outline object and save the indent in it
		Outline o = new Outline(name, value);
		o.indent = indent; // Save the number of indent spaces so group() will know what to do
		return o;

	} catch (IndexOutOfBoundsException e) { throw new DataException(); } // charAt() went beyond the end of s
}

/** If this Outline was parsed from a line of text in a text outline, the number of indent spaces it had, like 2 in "  name:value". */
private int indent;




// Parse

/**
 * Remove a group of lines of text from the start of c, and parse them into a List of String objects.
 * Lines end "\n" or "\r\n", and a blank line marks the end of the group.
 * Removes the terminating blank line from c, but doesn't include it in the return List.
 * If c doesn't have a blank line, throws a ChopException without changing c.
 */
public static List<String> group(Clip c) {
	Clip clip = c.copy(); // Make a copy to throw an exception with c unchanged
	List<String> list = new ArrayList<String>();
	while (true) {
		String line = line(clip); // Parse a line from data
		if (Text.isBlank(line)) break; // We got the blank line that ends the group, done
		list.add(line); // We got a line, add it to the list we'll return
	}
	c.keep(clip.size()); // That worked without an exception, remove the data we parsed from c
	return list;
}

/**
 * Remove one line of text from the start of c, and parse it into a String.
 * If c doesn't have a "\n", throws a ChopException and doesn't change c.
 * Works with lines that end with both "\r\n" and just "\n", removes both without trimming the String.
 */
public static String line(Clip c) {
	Split<Data> split = c.data().split((byte)'\n'); // The line ends "\r\n" or just "\n", split around "\n"
	if (!split.found) throw new ChopException(); // A whole line hasn't arrived yet
	Data before = split.before;
	if (before.ends((byte)'\r')) before = before.chop(1); // Remove the "\r"
	c.keep(split.after.size()); // That all worked, remove the data of the line from c
	return before.toString();
}












