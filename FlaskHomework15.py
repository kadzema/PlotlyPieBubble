from flask import Flask, jsonify, render_template
import json
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, inspect, func, desc, extract, select
# from dateutil.relativedelta import relativedelta
        

#################################################
# Flask Setup
#################################################
app = Flask(__name__)
#################################################
# Flask Routes
#################################################
@app.route("/")
def welcome():
    """Return the dashboard homepage."""
    return render_template("index.html")


@app.route('/names')
def names():
    """List of sample names.

    Returns a list of sample names in the format
    [
        "BB_940",
        "BB_941",
        "BB_943",
        "BB_944",
        "BB_945",
        "BB_946",
        "BB_947",
        ...
    ]

    """
    engine = create_engine("sqlite:///belly_button_biodiversity.sqlite", echo=False)
    md = sqlalchemy.MetaData()
    table = sqlalchemy.Table('Samples', md, autoload=True, autoload_with=engine)
    columns = table.c
    samples = []
    for c in columns:
        # print(c.name, c.type)
        if c.name != "otu_id":
            samples.append(c.name)
    return jsonify(samples)

@app.route('/otu')
def outs():
    """List of OTU descriptions.

    Returns a list of OTU descriptions in the following format

    [
        "Archaea;Euryarchaeota;Halobacteria;Halobacteriales;Halobacteriaceae;Halococcus",
        "Archaea;Euryarchaeota;Halobacteria;Halobacteriales;Halobacteriaceae;Halococcus",
        "Bacteria",
        "Bacteria",
        "Bacteria",
        ...
    ]
    """
    # also pull the ID so the data makes sense (even though the id aligns with its position)
    engine = create_engine("sqlite:///belly_button_biodiversity.sqlite", echo=False)
    Base = automap_base()
    Base.prepare(engine, reflect=True)
    Otu = Base.classes.otu
    session = Session(engine)
    # otuList = []
    otuDict = {}
    otus = session.query(Otu.otu_id,Otu.lowest_taxonomic_unit_found).all()
    for otu in otus:
        # otuList.append(otu[0])
        # use a dictionary instead so we have the id definitively
        # otuDict.update({otu[0]: otu[1]})
        # see if this is faster
        otuDict[otu[0]] = otu[1]
    # return jsonify(otuList)
    return jsonify(otuDict)

@app.route('/metadata/<sample>')
def metadata(sample):
    """MetaData for a given sample.

    Args: Sample in the format: `BB_940`

    Returns a json dictionary of sample metadata in the format

    {
        AGE: 24,
        BBTYPE: "I",
        ETHNICITY: "Caucasian",
        GENDER: "F",
        LOCATION: "Beaufort/NC",
        SAMPLEID: 940
    }
    """
    sample = sample.replace("BB_","")
    engine = create_engine("sqlite:///belly_button_biodiversity.sqlite", echo=False)
    Base = automap_base()
    Base.prepare(engine, reflect=True)
    Samples_metadata = Base.classes.samples_metadata
    session = Session(engine)
    metadata = session.query(Samples_metadata.AGE, Samples_metadata.BBTYPE, Samples_metadata.ETHNICITY, Samples_metadata.GENDER, Samples_metadata.LOCATION, Samples_metadata.SAMPLEID).filter_by(SAMPLEID=sample).first()
    metadict = {"AGE":metadata[0],"BBTYPE":metadata[1],"ETHNICITY":metadata[2], "GENDER":metadata[3],"LOCATION":metadata[4],"SAMPLEID":metadata[5]}
    return jsonify(metadict)

@app.route('/wfreq/<sample>')
def washing(sample):
    sample = sample.replace("BB_","")
    """Weekly Washing Frequency as a number.

    Args: Sample in the format: `BB_940`

    Returns an integer value for the weekly washing frequency `WFREQ`
    """
    engine = create_engine("sqlite:///belly_button_biodiversity.sqlite", echo=False)
    Base = automap_base()
    Base.prepare(engine, reflect=True)
    Samples_metadata = Base.classes.samples_metadata
    session = Session(engine)
    wfreq = session.query(Samples_metadata.WFREQ).filter_by(SAMPLEID=sample).scalar()
    # print(wfreq)
    return "<h1>"+str(wfreq) + "</h1>"


@app.route('/samples/<sample>')
def sample(sample):
    """OTU IDs and Sample Values for a given sample.

    Sort your Pandas DataFrame (OTU ID and Sample Value)
    in Descending Order by Sample Value

    Return a list of dictionaries containing sorted lists  for `otu_ids`
    and `sample_values`

    [
        {
            otu_ids: [
                1166,
                2858,
                481,
                ...
            ],
            sample_values: [
                163,
                126,
                113,
                ...
            ]
        }
    ]
    """
    engine = create_engine("sqlite:///belly_button_biodiversity.sqlite", echo=False)
    Base = automap_base()
    Base.prepare(engine, reflect=True)
    Samples = Base.classes.samples
    session = Session(engine)

    columns = ["otu_id",sample]
    otus = session.query(select(from_obj=Samples,columns=columns)).order_by(desc(sample)).all()
    otuList = []
    valueList = []
    for otu in otus:
        if otu[1] != 0:
            # print(otu[0])
            otuList.append(otu[0])
            valueList.append(otu[1])
    # print(otuList)
    sampleReturn = [{"otu_ids":otuList,"sample_values":valueList}]
    return jsonify(sampleReturn)


if __name__ == "__main__":
    app.run(debug=True)
