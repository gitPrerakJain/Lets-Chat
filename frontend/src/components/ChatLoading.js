import { Box, Stack } from "@chakra-ui/react";
import React from "react";
import { Skeleton, SkeletonCircle, SkeletonText } from "@chakra-ui/react";

const ChatLoading = () => {
  return (
    <div>
      <Stack>
        <Box
          padding={2}
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"center"}
          bg="white"
        >
          <SkeletonCircle size={"40px"} width="40px" height="35px" mr={2} />
          <SkeletonText
            spacing={"3"}
            width={"sm"}
            mt={"4"}
            ml={"2"}
            noOfLines={2}
            skeletonHeight={2}
          />
        </Box>
        <Box
          padding={2}
          display={"flex"}
          justifyContent={"space-around"}
          alignItems={"center"}
          bg="white"
        >
          <SkeletonCircle size={10} width={"40px"} />
          <SkeletonText
            spacing={"3"}
            width={"md"}
            mt={"4"}
            noOfLines={2}
            skeletonHeight={2}
          />
        </Box>
        <Box
          padding={2}
          display={"flex"}
          justifyContent={"space-around"}
          alignItems={"center"}
          bg="white"
        >
          <SkeletonCircle size={10} width={"40px"} />
          <SkeletonText
            spacing={"3"}
            width={"md"}
            mt={"4"}
            noOfLines={2}
            skeletonHeight={2}
          />
        </Box>
        <Box
          padding={2}
          display={"flex"}
          justifyContent={"space-around"}
          alignItems={"center"}
          bg="white"
        >
          <SkeletonCircle size={10} width={"40px"} />
          <SkeletonText
            spacing={"3"}
            width={"md"}
            mt={"4"}
            noOfLines={2}
            skeletonHeight={2}
          />
        </Box>
        <Box
          padding={2}
          display={"flex"}
          justifyContent={"space-around"}
          alignItems={"center"}
          bg="white"
        >
          <SkeletonCircle size={10} width={"40px"} />
          <SkeletonText
            spacing={"3"}
            width={"md"}
            mt={"4"}
            noOfLines={2}
            skeletonHeight={2}
          />
        </Box>
      </Stack>
    </div>
  );
};

export default ChatLoading;
