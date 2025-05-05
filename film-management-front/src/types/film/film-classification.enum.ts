export enum FilmClassification {
    ALL_AUDIENCES = "ALL_AUDIENCES",
    SEVEN_YEARS = "SEVEN_YEARS",
    TWELVE_YEARS = "TWELVE_YEARS",
    FIFTEEN_YEARS = "FIFTEEN_YEARS",
    EIGHTEEN_YEARS = "EIGHTEEN_YEARS"
}

export const classificationLabels: Record<FilmClassification, string> = {
    [FilmClassification.ALL_AUDIENCES]: "All audiences",
    [FilmClassification.SEVEN_YEARS]: "7+ years",
    [FilmClassification.TWELVE_YEARS]: "12+ years",
    [FilmClassification.FIFTEEN_YEARS]: "15+ years",
    [FilmClassification.EIGHTEEN_YEARS]: "18+ years"
};