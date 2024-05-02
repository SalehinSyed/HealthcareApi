/**
 * Type definition for the structure of an error object
 */
export type ValidationError = {
  /**
   * The path of the error
   */
  path: string[];

  /**
   * The error message
   */
  message: string;
};

/**
 * Type definition for the structure of a questionnaire object
 */
export type Questionnaire = {
  /**
   * The name of the person filling the questionnaire
   */
  name: string;

  /**
   * The age of the person
   */
  age: number;

  /**
   * The gender of the person
   */
  gender: string;

  /**
   * The health condition of the person
   */
  health_condition: string;

  /**
   * Whether the person has any symptoms
   */
  symptoms_present: boolean;

  /**
   * The list of symptoms, if any
   */
  symptoms_list: string;
};
