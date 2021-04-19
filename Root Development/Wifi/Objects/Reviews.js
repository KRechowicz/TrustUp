export default class Reviews {
    id: string;
    title: string;
    case: string;
    point: string;
    score: string;
    tldr: string;

    constructor(id, title, Case, Point, score, Tldr) {
        this.id = id;
        this.title = title;
        this.case = Case;
        this.point = Point;
        this.score = score;
        this.tldr = Tldr;
    }

}