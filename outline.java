

























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












// Parse from data

/** Parse data at the start of c into this new Outline object, and remove it from d. */
public Outline(Clip c) {
	this.contents = new ArrayList<Outline>();
	Clip clip = c.copy();                           // Copy d so if we throw an exception, it won't be changed
	name = clip.cut(numberParse(clip)).toString();  // Parse the name size, and then the name
	value = clip.cut(numberParse(clip)).copyData(); // Copy the value data into this new Outline object
	Clip d = clip.cut(numberParse(clip)).clip();    // Clip c around the data of the contents
	while (d.hasData())                             // Loop until c runs out of data
		contents.add(new Outline(d));               // Parse the Outline at the start of c, and add it to our list
	c.keep(clip.size());                            // Done without an exception, remove what we parsed from d
}

/** Parse 1 or more bytes at the start of d into a number, remove them from d, and return the number. */
private static int numberParse(Clip c) {
	int n = 0;
	while (true) {
		byte y = c.cut(1).first();  // Cut one byte from the start of d
		n = (n << 7) | (y & 0x7f);  // Move 7 bits into the bottom of n
		if ((y & 0x80) == 0) break; // If the leading bit is 0, we're done
	}
	if (n < 0) throw new DataException(); // Don't allow a negative size
	return n;
}










