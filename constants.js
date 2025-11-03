const HEADER = "Name	Path	Connection	PLC tag	DataType	Length	Coding	Access Method	Address	Indirect addressing	Index tag	Start value	ID tag	Display name [en-US]	Comment [en-US]	Acquisition mode	Acquisition cycle	Limit Upper 2 Type	Limit Upper 2	Limit Upper 1 Type	Limit Upper 1	Limit Lower 1 Type	Limit Lower 1	Limit Lower 2 Type	Limit Lower 2	Linear scaling	End value PLC	Start value PLC	End value HMI	Start value HMI	Gmp relevant	Confirmation Type	Mandatory Commenting"

const HEADER_ARRAY = HEADER.split("\t")

const END_OF_TAG_ROW = "Cyclic in operation	1 s	None	<No Value>	None	<No Value>	None	<No Value>	None	<No Value>	False	10	0	100	0	False	None	False".split("\t")
const COLMNS_BEFORE_COMMENT = ['False', '<No Value>', '<No Value>', 0, '<No Value>']
module.exports = {
    HEADER_ARRAY,
    END_OF_TAG_ROW,
    COLMNS_BEFORE_COMMENT
}