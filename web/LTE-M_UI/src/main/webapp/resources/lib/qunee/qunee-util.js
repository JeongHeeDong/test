var qunee = {
    createText: function (graph, host, name, x, y, anchorPosition, w, h, fontSize, fontColor, backgroundColor) {
        var text = graph.createText(name, x, y);
        // text.setStyle(Q.Styles.LABEL_PADDING, 5);
        text.tooltipType = "text";
        if(host){
            text.host = text.parent = host;
        }
        if(anchorPosition){
            text.anchorPosition = anchorPosition;
            text.setStyle(Q.Styles.LABEL_ALIGN_POSITION, anchorPosition);
        }
        if(w && h){
            text.setStyle(Q.Styles.LABEL_SIZE, new Q.Size(w, h));
        }

        text.setStyle(Q.Styles.LABEL_FONT_SIZE, fontSize || 14);
        text.setStyle(Q.Styles.LABEL_COLOR, fontColor || "#555");
        text.setStyle(Q.Styles.LABEL_BACKGROUND_COLOR, backgroundColor);
        return text;
    }
};