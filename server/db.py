import pymongo
from pymongo.errors import ConnectionFailure
from jsonschema import validate

validSchemaKeys = ['students', 'courses', 'results', 'studentID', 'courseID']
schemasMap = {
    'students': {
        "type": "object",
        "properties": {
            "firstName": {"type": "string"},
            "lastName": {"type": "string"},
            "email": {"type": "string"},
            "dob": {"type": "string"},
        },
         "required": ["firstName", "lastName", "email", "dob"],
    },
    'courses': {
        "type": "object",
        "properties": {
            "courseName": {"type": "string"},
        },
         "required": ["courseName"],
    },
    'results': {
        "type": "object",
        "properties": {
            "courseID": {"type": "string"},
            "studentID": {"type": "string"},
            "result": {"type": "string"},
        },
         "required": ["courseID", "studentID", "result"],
    },
    'studentID': {
        "type": "object",
        "properties": {
            "studentID": {"type": "string"},
        },
         "required": ["studentID"],
    },
    'courseID': {
        "type": "object",
        "properties": {
            "courseID": {"type": "string"},
        },
         "required": ["courseID"],
    }
}



def validateJSON(data, schemaKey):
    if schemaKey not in validSchemaKeys:
        raise ValueError('Collection {} is invalid'.format(schemaKey))
    validate(data, schemasMap[schemaKey])

def initDb():
    print('Establishing connection to DB...')
    dbClient = pymongo.MongoClient('mongodb://localhost:27017')
    try:
        dbClient.admin.command('ismaster')
    except ConnectionFailure:
        print("Server not available")
        exit()

    if 'shyftlabsDemo' in dbClient.list_database_names():
        # DB exists 
        print('Database found')
        demoDb = dbClient['shyftlabsDemo']
        # check collections

        for collection in validSchemaKeys:
            if collection not in demoDb.list_collection_names():
                print('Collection {} not found, creating collection'.format(collection))
                demoDb.create_collection(collection)
            else:
                print('Found collection {}'.format(collection))
    else:
        # create DB and collections
        print('DB not found, creating DB')
        demoDb = dbClient['shyftlabsDemo']
        for collection in validSchemaKeys:
            print('Creating collection {}'.format(collection))
            demoDb.create_collection(collection)
    return dbClient['shyftlabsDemo']
