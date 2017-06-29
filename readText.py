def readStudentDatabase(fname):
  file = open(fname, 'r').readlines()
  allStudents = []
  for line in file:
    if (line != "\n" and line != ""):
      segmentedLine = line.split(",")
      allStudents.append(segmentedLine)
  return allStudents


def modifyStudentDatabase(database, newStudent):
  database.append(newStudent)
  return database


def writeStudentDatabase(fname, newDatabase):
  databaseString = ""
  for student in newDatabase:
    for prop in student:
      if (student.index(prop) < len(student) - 1):   # don't want a comma at end of line (affects readDatabase function)
        databaseString += prop + ","
      else:
        databaseString += prop

  file = open(fname, 'r+')
  file.truncate()                 # erase existing database
  file.write(databaseString)      # write new database
  file.close()


def main():
  newStudent = ['new', 'Josh', 'basketball', 'steststs', 'me']
  databaseFile = "/Users/JoshBloom/Desktop/studentDatabase.txt"
  
  oldDatabase = readStudentDatabase(databaseFile)                   # get existing database
  newDatabase = modifyStudentDatabase(oldDatabase, newStudent)      # modify database Array
  updateDatabase = writeStudentDatabase(databaseFile, newDatabase)  # set database ()

main()