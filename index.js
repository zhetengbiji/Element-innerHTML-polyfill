(function() {
    // The innerHTML DOM property for Element.
    if('innerHTML' in Element.prototype) {
        return;
    }
    Object.defineProperty(Element.prototype, 'innerHTML', {
        get: function() {
            var output = [];
            var childNode = this.firstChild;
            var serializer = new XMLSerializer();
            while(childNode) {
                output.push(serializer.serializeToString(childNode));
                childNode = childNode.nextSibling;
            }
            return output.join('');
        },
        set: function(text) {
            while(this.firstChild) {
                this.removeChild(this.firstChild);
            }
            var parser = new DOMParser();
            parser.async = false;
            var xml = '<root>' + text + '</root>';
            var element;
            var childNode;
            try {
                element = parser.parseFromString(xml, 'text/xml').documentElement;
                childNode = element.firstChild;
                while(childNode) {
                    this.appendChild(this.ownerDocument.importNode(childNode, true));
                    childNode = childNode.nextSibling;
                }
            } catch(e) {
                throw new Error('Error parsing XML string');
            };
        }
    });
})();