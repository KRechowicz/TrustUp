library(tidyverse)
library(tokenizers)
read_txt_file_into_tibble = function(file)
{
  file_contents = read_file(file)
  Text = file_contents %>% tokenize_sentences() %>% unlist()
  
  text_tibble = Text %>% as.data.frame()
  colnames(text_tibble) = c("Text")
  text_tibble = text_tibble %>% add_column(ID = NA)
  text_tibble = text_tibble %>% mutate(ID = row_number())
  text_tibble = text_tibble %>% select(ID, Text)
  text_tibble = text_tibble %>% mutate(Text = as.character(Text))
  text_tibble = text_tibble %>% mutate(Text = tolower(Text))
  text_tibble = text_tibble %>% as_tibble()
  return(text_tibble)
}

read_all_files_in_dir_into_tibble = function(directory, replace_vendor=FALSE)
{
  
  # recursive get all vendors text files in directory indicated by parameter
  files_in_dir = list.files(directory, recursive = T)
  directory_prefix_length = (directory %>% length() + 1)
  # create data structure to aggregate into
  text_tibble = tibble(ID = numeric(),
                       Vendor = character(),
                       Text = character())
  
  # loop over text files and add them into aggregate table
  for (i in 1:length(files_in_dir))
  {
    working_directory = getwd()
    current_file = files_in_dir[i]
    this_file_as_tbl = read_csv(paste0(working_directory, "/", directory, current_file))
    if (replace_vendor)
    {
      # to get more manageable classification names use directory names
      current_vendor = current_file %>% str_extract(pattern = "^[a-zA-Z]+\\-*[a-zA-z]*")
      this_file_as_tbl = this_file_as_tbl %>% mutate(Vendor = current_vendor)
    }
    this_file_as_tbl = this_file_as_tbl %>% mutate(Text = tolower(Text))
    text_tibble = text_tibble %>% bind_rows(this_file_as_tbl)
  }
  
  # make sure all IDs are unique
  text_tibble = text_tibble %>% mutate(ID = row_number())
  return(text_tibble)
}