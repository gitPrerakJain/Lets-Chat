import React, { useEffect, useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import {
  Box,
  FormControl,
  IconButton,
  Image,
  Input,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSenderDetails, getSenderName } from "../../config/ChatLogics";
import ProfileModal from "../miscellaneous/ProfileModal";
import UpdateGroupChatModal from "../miscellaneous/UpdateGroupChatModal";
import axios from "axios";

import io from "socket.io-client";
import ScrollableChat from "../ScrollableChat";
const ENDPOINT = "https://lets-chat-uk7b.onrender.com";
let socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat } = ChatState();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState();
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const toast = useToast();

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      setLoading(true);
      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );

      // console.log(messages);
      setMessages(data);
      // console.log(messages);
      setLoading(false);

      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.stack,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };

        setNewMessage("");
        const { data } = await axios.post(
          "/api/message",
          { content: newMessage, chatId: selectedChat._id },
          config
        );

        // console.log(data);
        socket.emit("new message", data);
        setMessages([...messages, data]);
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to send the message",
        });
      }
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, []);

  useEffect(() => {
    setNewMessage("");

    fetchMessages();

    selectedChatCompare = selectedChat;
    // console.log("inside useEffect");
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message received", (newMessageRecieved) => {
      if (
        !selectedChatCompare || // if chat is not selected or doesn't match current chat
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        setFetchAgain(!fetchAgain);
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let timeSinceTyping = new Date().getTime();
    setTimeout(() => {
      let currentTime = new Date().getTime();
      let timeDiff = currentTime - timeSinceTyping;
      if (timeDiff > 3000 && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, 3000);
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={"2rem"}
            pb={3}
            px={2}
            w="100%"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              d={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => {
                setSelectedChat("");
              }}
            />

            {!selectedChat.isGroupChat ? (
              <>
                {getSenderName(user, selectedChat.users)}
                <ProfileModal
                  user={getSenderDetails(user, selectedChat.users)}
                />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                />
              </>
            )}
          </Text>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
              <Spinner
                alignSelf={"center"}
                size={"2xl"}
                w={100}
                h={100}
                margin={"auto"}
              />
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  overflowY: "scroll",
                  scrollbarWidth: "none",
                }}
              >
                {/* {console.log("scroll")} */}
                <ScrollableChat messages={messages} />
              </div>
            )}

            <FormControl onKeyDown={sendMessage} isRequired mt={5}>
              {isTyping ? (
                <div style={{ height: "50px", width: "50px" }}>
                  <Image
                    boxSize={35}
                    src={
                      new URL(
                        `../../Assets/typingIndicator.gif`,
                        import.meta.url
                      ).href
                    }
                  />
                </div>
              ) : (
                <></>
              )}
              <Input
                variant={"filled"}
                bg={"#E0E0E0"}
                placeholder="Enter message here..."
                value={newMessage}
                onChange={typingHandler}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          h={"100%"}
        >
          <Text fontSize={"3xl"}> Click on a user to start chatting!!!</Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
