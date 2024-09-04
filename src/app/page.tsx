"use client";

import React, { useState, useEffect, useRef } from "react";
import { format, parse, isValid } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, SearchIcon } from "lucide-react";

export default function Component() {
  const [note, setNote] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const savedNote = localStorage.getItem("longNote");
    if (savedNote) {
      setNote(savedNote);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("longNote", note);
  }, [note]);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate && isValid(selectedDate)) {
      setDate(selectedDate);
      const formattedDate = format(selectedDate, "yyyy-MM-dd");
      const regex = new RegExp(`\\[${formattedDate}\\]`);
      const match = note.match(regex);
      if (match) {
        const index = match.index;
        if (index !== undefined && textareaRef.current) {
          textareaRef.current.focus();
          textareaRef.current.setSelectionRange(index, index);
          textareaRef.current.scrollTop = index > 100 ? index - 100 : 0;
        }
      } else {
        const newEntry = `\n\n[${formattedDate}]\n`;
        setNote((prevNote) => prevNote + newEntry);
        if (textareaRef.current) {
          textareaRef.current.focus();
          textareaRef.current.setSelectionRange(
            note.length + newEntry.length,
            note.length + newEntry.length
          );
          textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
        }
      }
    }
  };

  const handleSearch = () => {
    if (searchTerm && textareaRef.current) {
      const searchRegex = new RegExp(searchTerm, "i");
      const match = note.match(searchRegex);
      if (match) {
        const index = match.index;
        if (index !== undefined) {
          textareaRef.current.focus();
          textareaRef.current.setSelectionRange(
            index,
            index + searchTerm.length
          );
          textareaRef.current.scrollTop = index > 100 ? index - 100 : 0;
        }
      }
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-4">Long Note App</h1>
      <div className="flex space-x-4 mb-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">
              <CalendarIcon className="mr-2 h-4 w-4" />
              Select Date
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateSelect}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        <div className="flex-1 flex space-x-2">
          <Input
            type="text"
            placeholder="Search in note..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button onClick={handleSearch}>
            <SearchIcon className="mr-2 h-4 w-4" />
            Search
          </Button>
        </div>
      </div>
      <ScrollArea className="h-[calc(100vh-200px)] w-full rounded-md border">
        <textarea
          ref={textareaRef}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full h-full p-4 resize-none focus:outline-none"
          placeholder="Start writing your long note here..."
        />
      </ScrollArea>
    </div>
  );
}
