# Anatomy of Knowledge Cleaning Ontology (AKCO)

The **Anatomy of Knowledge Cleaning Ontology** is a semantic framework for representing key aspects of knowledge cleaning. Its primary motivation is supporting the **selection** and **application** of knowledge cleaning approaches for cleaning a given graph. 

The cleaning process involves the **detection** and **correction** of specific errors. An error is defined along its **source**, **nature** and **type**. Cleaning approaches use various **techniques** to process assertions, determine their correctness, or identify suitable corrections. Different types of background knowledge are used for this processing. This **background knowledge** serves as the context for error detection and correction. 

The different ways of processing assertions result in different dimensions of approaches and techniques. These dimensions are characteristics, like whether additional sources are used as background knowledge or only the given knowledge graph. 

The dimensions determine the type of dependency an approach or technique has on the background knowledge. Therefore, for a successful implementation of an approach, it is required that the background knowledge fulfill certain quality criteria. The ontology defines quality specifications for background knowledge and knowledge graphs. These specifications, in combination with the requirements of the approaches, allow for the selection of appropriate approaches. 

After the selection of the approaches, these need to be applied. This application must ensure that detected errors are true errors, avoiding false negative assertions or false positive errors. The former represents correct assertions that are falsely detected as erroneous. The latter describes correct assertions. However, another directly related assertion is erroneous, causing the error. If an error is ensured, an appropriate correction must be found, and the results of this prediction must be validated to avoid replacing one incorrect entity with another. 

The ontology provides concepts and relations to support both of these tasks. In addition, it allows answering several subordinate questions, such as what type of error-specific approaches target or their dimensions. 

The ontology can be found at: https://d-workz.github.io/akco/
It is provided in different notations: 
- turtle: [ontology.ttl](ontology.ttl)
- json-LD: [ontology.jsonld](ontology.jsonld)
- notion3: [ontology.nt](ontology.nt) 
- OWL/xml: [ontology.owl](ontology.)

### Author
- Dennis Sommer

### Sources

The HTML documentation of the ontology is created using:
- [Widoco](https://dgarijo.github.io/Widoco/) 

The design uses the insights of:
- [Ontology Development 101: A Guide to Creating Your First Ontology](https://protege.stanford.edu/publications/ontology_development/ontology101.pdf)
- [LOT: An industrial oriented ontology engineering framework](https://www.sciencedirect.com/science/article/pii/S0952197622000525)
